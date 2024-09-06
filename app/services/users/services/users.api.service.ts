import { Injectable } from "@vigilio/express-core";
import { Users } from "../entities/users.entity";
import {
	BadRequestException,
	InternalServerErrorException,
	NotFoundException,
} from "@vigilio/express-core";
import { type UsersStoreDto } from "../dtos/users.store.dto";
import { type UsersUpdateDto } from "../dtos/users.update.dto";
import { removeFile } from "@/uploads/libs/helpers";
import { generateCodeEntity } from "~/libs/helpers";
import type { UsersProfileDto } from "../dtos/users.profile.dto";
import bcryptjs from "bcryptjs";
import type { UsersPasswordDto } from "../dtos/users.password.dto";
import type { InformationEntity } from "@/information/entities/information.entity";

@Injectable()
export class UsersApiService {
	async index() {
		const data = await Users.scope("hiddePassword").findAll();
		return {
			success: true,
			data,
		};
	}

	async show(information: InformationEntity, slug: string) {
		let user = null;
		if (!Number.isNaN(Number(slug))) {
			user = await Users.scope("hiddePassword").findOne({
				where: {
					id: slug,
					information_id: information.id,
				},
			});
		} else {
			user = await Users.scope("hiddePassword").findOne({
				where: {
					slug,
					information_id: information.id,
				},
			});
		}
		if (!user) {
			throw new NotFoundException(`No se encontró un usuario con ${slug}`);
		}
		return {
			success: true,
			user,
		};
	}

	async store(information: InformationEntity, usersStoreDto: UsersStoreDto) {
		const user = new Users({
			...usersStoreDto,
			information_id: information.id,
		});
		user.user_code = await generateCodeEntity(
			Users,
			"user_code" as keyof Users,
			"USER",
			information,
		);
		user.password = bcryptjs.hashSync(
			usersStoreDto.password,
			bcryptjs.genSaltSync(10),
		);
		await user.save();

		return {
			success: true,
			user,
		};
	}

	async update(
		information: InformationEntity,
		id: string,
		usersUpdateDto: UsersUpdateDto,
	) {
		const { user } = await this.show(information, id);
		const adminSuper = await Users.findOne({
			order: [["id", "ASC"]],
			attributes: ["id"],
			where: { information_id: information.id },
		});
		if (user.id === adminSuper?.id)
			throw new BadRequestException("No se puede editar al administrador");

		await user.update(usersUpdateDto);
		return {
			success: true,
			user,
		};
	}

	async changePassword(
		information: InformationEntity,
		body: UsersPasswordDto,
		user: Users,
	) {
		if (body.newPassword !== body.repeatNewPassword) {
			throw new BadRequestException("Contraseña no similares", {
				body: "repeatNewPassword" as keyof UsersPasswordDto,
			});
		}
		const findUser = await Users.findOne({
			where: { user_id: user.id, information_id: information.id },
			attributes: ["password"],
		});
		if (!findUser) throw new InternalServerErrorException("Error de servidor");

		if (!bcryptjs.compareSync(body.passwordActual, findUser.password)) {
			throw new BadRequestException("Contraseña incorrecta", {
				body: "passwordActual" as keyof UsersPasswordDto,
			});
		}
		// cambiar de contraseña
		user.password = bcryptjs.hashSync(
			body.repeatNewPassword,
			bcryptjs.genSaltSync(10),
		);
		await user.save();
		return {
			success: true,
			message: "Se cambió la contraseña correctamente",
		};
	}
	async profile(usersProfileDto: UsersProfileDto, user: Users) {
		await user.update(usersProfileDto);

		return {
			success: true,
			user,
		};
	}

	async destroy(information: InformationEntity, id: string) {
		const { user } = await this.show(information, id);
		const adminSuper = await Users.findOne({
			order: [["id", "ASC"]],
			attributes: ["id"],
			where: { information_id: information.id },
		});
		if (user.id === adminSuper?.id)
			throw new BadRequestException("No se puede eliminar al administrador");

		await user.destroy();
		if (user.photo) {
			removeFile(information.slug, user.photo);
		}
		return {
			success: true,
			message: `El usuario con el id: ${id} fue eliminado`,
		};
	}
}
