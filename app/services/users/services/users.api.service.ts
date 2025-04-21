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
import type { Empresas } from "@/empresas/entities/empresas.entity";
import { Op } from "sequelize";

@Injectable()
export class UsersApiService {
    async index() {
        const data = await Users.scope("hiddePassword").findAll();
        return {
            success: true,
            data,
        };
    }

    async show(empresa: Empresas, slug: string) {
        let user = null;
        if (!Number.isNaN(Number(slug))) {
            user = await Users.scope("hiddePassword").findOne({
                where: {
                    id: slug,
                    empresa_id: empresa.id,
                },
            });
        } else {
            user = await Users.scope("hiddePassword").findOne({
                where: {
                    slug,
                    empresa_id: empresa.id,
                },
            });
        }
        if (!user) {
            throw new NotFoundException(
                `No se encontró un usuario con ${slug}`
            );
        }
        return {
            success: true,
            user,
        };
    }

    async store(empresa: Empresas, usersStoreDto: UsersStoreDto) {
        const user = new Users({
            ...usersStoreDto,
            enabledNotification: true,
            empresa_id: empresa.id,
        });
        user.user_code = await generateCodeEntity(
            Users,
            "user_code" as keyof Users,
            "USER",
            empresa
        );
        user.password = bcryptjs.hashSync(
            usersStoreDto.password,
            bcryptjs.genSaltSync(10)
        );
        await user.save();

        return {
            success: true,
            user,
        };
    }

    async update(
        empresa: Empresas,
        id: string,
        usersUpdateDto: UsersUpdateDto
    ) {
        const { user } = await this.show(empresa, id);
        const [adminSuper, existOtherBot] = await Promise.all([
            Users.findOne({
                order: [["id", "ASC"]],
                attributes: ["id"],
                where: { empresa_id: empresa.id },
            }),
            Users.findOne({
                attributes: ["id", "isBot", "username"],
                where: {
                    empresa_id: empresa.id,
                    isBot: true,
                    [Op.not]: {
                        id,
                    },
                },
            }),
        ]);
        if (existOtherBot && usersUpdateDto.isBot) {
            throw new BadRequestException(
                `Solo puede haber un bot usuario ${existOtherBot.username}`
            );
        }
        if (user.id === adminSuper?.id)
            throw new BadRequestException(
                "No se puede editar al administrador"
            );

        await user.update(usersUpdateDto);
        return {
            success: true,
            user,
        };
    }

    async changePassword(
        empresa: Empresas,
        body: UsersPasswordDto,
        user: Users
    ) {
        if (body.newPassword !== body.repeatNewPassword) {
            throw new BadRequestException("Contraseña no similares", {
                body: "repeatNewPassword" as keyof UsersPasswordDto,
            });
        }
        const findUser = await Users.findOne({
            where: { id: user.id, empresa_id: empresa.id },
            attributes: ["password", "id", "empresa_id"],
        });
        if (!findUser)
            throw new InternalServerErrorException("Error de servidor");

        if (!bcryptjs.compareSync(body.passwordActual, findUser.password)) {
            throw new BadRequestException("Contraseña incorrecta", {
                body: "passwordActual" as keyof UsersPasswordDto,
            });
        }
        // cambiar de contraseña
        user.password = bcryptjs.hashSync(
            body.repeatNewPassword,
            bcryptjs.genSaltSync(10)
        );
        await user.save();
        return {
            success: true,
            message: "Se cambió la contraseña correctamente",
        };
    }
    async profile(
        empresa: Empresas,
        usersProfileDto: UsersProfileDto,
        user: Users
    ) {
        const [byEmail, byTelephone] = await Promise.all([
            Users.findOne({
                where: {
                    email: usersProfileDto.email,
                    empresa_id: empresa.id,
                    [Op.not]: {
                        id: user.id,
                    },
                },
                raw: true,
            }),
            Users.findOne({
                where: {
                    telephone: usersProfileDto.telephone,
                    empresa_id: empresa.id,
                    id: { [Op.not]: user.id },
                },
                raw: true,
            }),
        ]);

        if (byEmail) {
            throw new BadRequestException(
                `Ya existe un usuario con el email: ${usersProfileDto.email}`,
                { body: "email" }
            );
        }
        if (byTelephone) {
            throw new BadRequestException(
                "Ya existe un usuario con este telefono",
                {
                    body: "telephone",
                }
            );
        }

        await user.update(usersProfileDto);

        return {
            success: true,
            user,
        };
    }

    async destroy(empresa: Empresas, id: string) {
        const { user } = await this.show(empresa, id);
        const adminSuper = await Users.findOne({
            order: [["id", "ASC"]],
            attributes: ["id"],
            where: { empresa_id: empresa.id },
        });
        if (user.id === adminSuper?.id)
            throw new BadRequestException(
                "No se puede eliminar al administrador"
            );

        await user.destroy();
        if (user.photo) {
            await removeFile(empresa.slug, user.photo);
        }
        return {
            success: true,
            message: `El usuario con el id: ${id} fue eliminado`,
        };
    }
}
