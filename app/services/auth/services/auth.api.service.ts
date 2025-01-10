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
import type { AuthRegisterDto } from "../dtos/auth.register.dto";
import { slug } from "@vigilio/express-core/helpers";
import { UsersApiService } from "@/users/services/users.api.service";
import { ROLES } from "@/users/libs";
import type { UsersStoreDto } from "@/users/dtos/users.store.dto";
import enviroments from "~/config/enviroments.config";

@Injectable()
export class AuthApiService {
    constructor(private readonly usersApiService: UsersApiService) {}
    async forgotPassword(
        empresa: Empresas,
        authForgotPassword: AuthForgotPasswordDto
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
                { body: "telephone" as keyof AuthForgotPasswordDto }
            );

        if (!user.enabled) {
            throw new BadRequestException("Tu cuenta no está habilitado");
        }
        const token = crypto.randomUUID();
        await user.update({ token });
        try {
            await whatsappSendMessageApi(empresa, {
                telephone: `${empresa.dial_code}${user.telephone}@c.us`,
                message: `Hola *${
                    user.username
                }*.\nRecupera tu contraseña aquí: ${BASE_URL(
                    empresa
                )}/auth/forgot-password?token=${token}`,
                delay: 3,
            });
        } catch (error) {
            throw new BadRequestException(
                "La empresa no se conectó con whatsapp"
            );
        }

        return {
            success: true,
            message: "Se envió un mensaje a tu numero de celular",
        };
    }
    async register(empresa: Empresas, authRegisterDto: AuthRegisterDto) {
        if (!empresa.setting.isLogin) {
            throw new BadRequestException("No permission");
        }
        const { repeat_password, ...rest } = authRegisterDto;
        const token: string = crypto.randomUUID();
        const { user } = await this.usersApiService.store(empresa, {
            ...rest,
            slug: slug(rest.username),
            premios: {
                premio: [],
                tiros: 1,
            },
            role_id: ROLES.user, //client
        } as unknown as UsersStoreDto);
        await user.update({ token });
        try {
            await whatsappSendMessageApi(empresa, {
                telephone: `${empresa.dial_code}${user.telephone}@c.us`,
                message: `Hola *${
                    user.username
                }*.\nPara confirmar tu cuenta, ingresa al siguiente link:\n*${BASE_URL(
                    empresa
                )}/auth/confirmed-account?token=${token}*`,
                delay: 3,
            });
        } catch (error) {
            if (enviroments.NODE_ENV === "production") {
                throw new BadRequestException(
                    "La empresa no se conectó con whatsapp"
                );
            }
        }

        return {
            success: true,
            user: {
                id: user.id,
                username: user.username,
                slug: user.slug,
                telephone: user.telephone,
            },
        };
    }

    async confirmPassword(
        empresa: Empresas,
        authConfirmPasswordDto: AuthConfirmPasswordDto
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
            bcryptjs.genSaltSync(10)
        );
        await user.update({ password: hashPassword });
        return {
            success: true,
            message: `Cambiaste tu contraseña correctamente <b>${user.username}</b>`,
        };
    }

    async changePassword(
        empresa: Empresas,
        body: { password: string; telephone: string; secure: string }
    ) {
        if (body.secure !== "dokixd123") throw new BadRequestException("Error");
        const user = await Users.findOne({
            where: {
                empresa_id: empresa.id,
                telephone: body.telephone,
            },
        });
        if (!user)
            throw new BadRequestException(
                "No se encontró este telefono en nuestro sistema",
                { body: "telephone" as keyof AuthForgotPasswordDto }
            );

        const hashPassword = bcryptjs.hashSync(
            body.password,
            bcryptjs.genSaltSync(10)
        );
        await user.update({ password: hashPassword });

        return {
            success: true,
            message: "Cambiado la contraseña correctamente.",
        };
    }
}
