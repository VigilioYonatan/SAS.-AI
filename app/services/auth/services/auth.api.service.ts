import { Injectable } from "@vigilio/express-core";
import { Users } from "@/users/entities/users.entity";
import { BadRequestException, NotFoundException } from "@vigilio/express-core";
import bcryptjs from "bcryptjs";
import crypto from "node:crypto";
import type { AuthForgotPasswordDto } from "../dtos/auth.forgot-password.dto";
import type { AuthConfirmPasswordDto } from "../dtos/auth.confirm-password.dto";
import { whatsappSendMessageApi } from "@/bot/api";
import type { Empresas } from "@/empresas/entities/empresas.entity";
import { BASE_URL } from "@/empresas/libs";

@Injectable()
export class AuthApiService {
	async forgotPassword(
		empresa: Empresas,
		authForgotPassword: AuthForgotPasswordDto,
	) {
		const user = await Users.findOne({
			where: {
				telephone: authForgotPassword.telephone,
				empresa_id: empresa.id,
			},
		});
		if (!user)
			throw new BadRequestException(
				"No se encontró este telefono en nuestro sistema",
				{ body: "telephone" as keyof AuthForgotPasswordDto },
			);

		if (!user.enabled) {
			throw new BadRequestException("Tu cuenta no está habilitado");
		}
		const token = crypto.randomUUID();
		await user.update({ token });
		await whatsappSendMessageApi(empresa, {
			telephone: `${empresa.dial_code}${user.telephone}@c.us`,
			message: `Hola *${
				user.username
			}*.\nRecupera tu contraseña aquí: ${BASE_URL(
				empresa,
			)}/auth/forgot-password?token=${token}`,
		});

		return {
			success: true,
			message: "Se envió un mensaje a tu numero de celular",
		};
	}

	async confirmPassword(
		empresa: Empresas,
		authConfirmPasswordDto: AuthConfirmPasswordDto,
	) {
		const user = await Users.findOne({
			where: {
				id: authConfirmPasswordDto.user_id,
				empresa_id: empresa.id,
			},
		});
		if (!user) throw new NotFoundException("Usuario no válido");
		const hashPassword = bcryptjs.hashSync(
			authConfirmPasswordDto.password,
			bcryptjs.genSaltSync(10),
		);
		await user.update({ password: hashPassword });
		return {
			success: true,
			message: `Cambiaste tu contraseña correctamente <b>${user.username}</b>`,
		};
	}
}
