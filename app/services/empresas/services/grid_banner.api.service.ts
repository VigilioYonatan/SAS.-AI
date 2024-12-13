import { Injectable } from "@vigilio/express-core";
import { NotFoundException } from "@vigilio/express-core";
import { Empresas } from "../entities/empresas.entity";
import { GridBanner } from "../entities/grid_banner.entity";
import type { GridBannerUpdateDto } from "../dtos/grid_banner.update.dto";

@Injectable()
export class GridBannerApiService {
    async index(empresa: Empresas) {
        const data = await GridBanner.findAll({
            where: {
                empresa_id: empresa.id,
            },
            order: [["id", "ASC"]],
        });

        return {
            success: true,
            data,
        };
    }
    async show(empresa: Empresas, id: string) {
        const gridBanner = await GridBanner.findOne({
            where: {
                id,
                empresa_id: empresa.id,
            },
        });
        if (!gridBanner) {
            throw new NotFoundException(
                `No se encontró un reclamo con el id ${id}`
            );
        }
        return {
            success: true,
            gridBanner,
        };
    }

    async update(empresa: Empresas, id: string, body: GridBannerUpdateDto) {
        const { gridBanner } = await this.show(empresa, id);
        await gridBanner.update({ ...body, empresa_id: empresa.id });
        return {
            success: true,
            message: "Editado correctamente gridBanner",
        };
    }
}
