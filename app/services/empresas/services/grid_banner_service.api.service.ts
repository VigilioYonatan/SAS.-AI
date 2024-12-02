import { Injectable } from "@vigilio/express-core";
import { NotFoundException } from "@vigilio/express-core";
import { Empresas } from "../entities/empresas.entity";
import { Banner } from "../entities/banner.entity";
import { GridBannerService } from "../entities/grid_banner_service.entity";
import type { GridBannerServiceUpdateDto } from "../dtos/grid_banner_service.update.dto";
import { GridBanner } from "../entities/grid_banner.entity";

@Injectable()
export class GridBannerServiceApiService {
    async index(empresa: Empresas) {
        const data = await GridBannerService.findAll({
            where: {
                empresa_id: empresa.id,
            },
            include: [
                { model: Banner, order: [["order", "ASC"]] },
                {
                    model: GridBanner,
                    include: [{ model: Banner, order: [["order", "ASC"]] }],
                    where: {
                        empresa_id: empresa.id,
                    },
                },
            ],
            order: [["id", "ASC"]],
        });

        return {
            success: true,
            data,
        };
    }
    async show(empresa: Empresas, id: string) {
        const gridBannerService = await GridBannerService.findOne({
            where: {
                id,
                empresa_id: empresa.id,
            },
        });
        if (!gridBannerService) {
            throw new NotFoundException(
                `No se encontró un reclamo con el id ${id}`
            );
        }
        return {
            success: true,
            gridBannerService,
        };
    }

    async update(
        empresa: Empresas,
        id: string,
        body: GridBannerServiceUpdateDto
    ) {
        const { gridBannerService } = await this.show(empresa, id);
        await gridBannerService.update({ ...body, empresa_id: empresa.id });
        return {
            success: true,
            message: "Editado correctamente gridBannerService",
        };
    }
}
