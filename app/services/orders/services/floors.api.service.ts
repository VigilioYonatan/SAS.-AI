import { Injectable } from "@vigilio/express-core";
import { Floors } from "../entities/floors.entity";
import { BadRequestException, NotFoundException } from "@vigilio/express-core";

import { Op } from "sequelize";
import type { FloorsStoreDto } from "../dtos/floors.store.dto";
import type { FloorsUpdateDto } from "../dtos/floors.update.dto";
import type { Empresas } from "@/empresas/entities/empresas.entity";

@Injectable()
export class FloorsApiService {
    async index(empresa: Empresas) {
        const data = await Floors.unscoped().findAll({
            where: {
                empresa_id: empresa.id,
            },
        });
        return {
            success: true,
            data,
        };
    }

    async show(empresa: Empresas, id: string) {
        const floor = await Floors.unscoped().findOne({
            where: {
                id,
                empresa_id: empresa.id,
            },
        });
        if (!floor) throw new NotFoundException(`No se encontró piso ${id}`);
        return {
            success: true,
            floor,
        };
    }
    async mesas(empresa: Empresas, id: string) {
        const { floor } = await this.show(empresa, id);
        const data = await floor.$get("mesas");
        return {
            success: true,
            data,
        };
    }

    async store(empresa: Empresas, body: FloorsStoreDto) {
        const floor = new Floors({ ...body, empresa_id: empresa.id });
        await floor.save();
        return {
            success: true,
            floor,
        };
    }
    async update(empresa: Empresas, id: string, body: FloorsUpdateDto) {
        const { floor } = await this.show(empresa, id);
        const [byName] = await Promise.all([
            Floors.unscoped().findOne({
                where: {
                    name: body.name,
                    empresa_id: empresa.id,
                    id: { [Op.not]: id },
                },
                raw: true,
            }),
        ]);

        if (byName) {
            throw new BadRequestException(
                `Ya existe ese nombre para el floor ${body.name}`
            );
        }
        await floor.update(body);
        return {
            success: true,
            floor,
        };
    }
    async destroy(empresa: Empresas, id: string) {
        const { floor } = await this.show(empresa, id);
        await floor.destroy();
        return {
            success: true,
            message: `Eliminado floor correctamente ${id}`,
        };
    }
}
