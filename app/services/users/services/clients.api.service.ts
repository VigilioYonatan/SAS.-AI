import { Injectable } from "@vigilio/express-core";
import { Clients } from "../entities/clients.entity";
import { NotFoundException } from "@vigilio/express-core";
import { type ClientsStoreDto } from "../dtos/clients.store.dto";
import type { Empresas } from "@/empresas/entities/empresas.entity";

@Injectable()
export class ClientsApiService {
    async index(empresa: Empresas) {
        const data = await Clients.findAll({
            where: {
                empresa_id: empresa.id,
            },
        });
        return {
            success: true,
            data,
        };
    }

    async show(empresa: Empresas, telephone: string) {
        const client = await Clients.findOne({
            where: {
                telephone: telephone,
                empresa_id: empresa.id,
            },
        });
        if (!client) {
            throw new NotFoundException(
                `No se encontró un usuario con ${telephone}`
            );
        }
        return {
            success: true,
            client,
        };
    }

    async store(empresa: Empresas, clientsStoreDto: ClientsStoreDto) {
        const client = new Clients({
            ...clientsStoreDto,
            empresa_id: empresa.id,
        });

        await client.save();

        return {
            success: true,
            client,
        };
    }

    async update(
        empresa: Empresas,
        id: string,
        clientsUpdateDto: ClientsStoreDto
    ) {
        const { client } = await this.show(empresa, id);
        await client.update(clientsUpdateDto);
        return {
            success: true,
            client,
        };
    }

    async destroy(empresa: Empresas, id: string) {
        const { client } = await this.show(empresa, id);

        await client.destroy();

        return {
            success: true,
            message: `El usuario con el id: ${id} fue eliminado`,
        };
    }
}
