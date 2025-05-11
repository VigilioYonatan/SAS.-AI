import { Empresas } from "@/empresas/entities/empresas.entity";
import { BadRequestException, Injectable } from "@vigilio/express-core";
import type { UsersFormStoreDto } from "../dtos/users-form.dto";
import { UsersForm } from "../entities/users-form.entity";

@Injectable()
export class UsersFormApiService {
    async show(empresa: Empresas, id: string) {
        const userForm = await UsersForm.findOne({
            where: {
                id,
                empresa_id: empresa.id,
            },
        });
        if (!userForm) {
            throw new BadRequestException("No se encontró user form");
        }
        return {
            success: true,
            userForm,
        };
    }
    async store(empresa: Empresas, body: UsersFormStoreDto) {
        const { api_key, ...rest } = body;
        const existTelephone = await UsersForm.findOne({
            where: {
                telephone: body.telephone,
                empresa_id: empresa.id,
            },
        });
        if (existTelephone) {
            return {
                success: true,
                message: "Ya existe un usuario con este telefono",
            };
        }
        await UsersForm.create({
            ...rest,
            empresa_id: empresa.id,
        });
        return {
            success: true,
            message: "Executed succelly",
        };
    }

    async destroy(empresa: Empresas, id: string) {
        const { userForm } = await this.show(empresa, id);
        await userForm.destroy();
        return {
            success: true,
            message: "Executed succelly",
        };
    }
}
