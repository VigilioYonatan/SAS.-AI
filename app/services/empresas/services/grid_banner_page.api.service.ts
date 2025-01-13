import { Injectable } from "@vigilio/express-core";
import { NotFoundException } from "@vigilio/express-core";
import { Empresas } from "../entities/empresas.entity";
import { GridBanner } from "../entities/grid_banner.entity";
import { GridBannerPage } from "../entities/grid_banner_page.entity";
import type { GridBannerPageUpdateDto } from "../dtos/grid_banner_page.update.dto";
import cache from "@vigilio/express-core/cache";

@Injectable()
export class GridBannerPageApiService {
    async index(empresa: Empresas) {
        const data = await GridBannerPage.findAll({
            where: {
                empresa_id: empresa.id,
            },
            include: [
                {
                    model: GridBanner,
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
        const gridBannerService = await GridBannerPage.findOne({
            where: {
                id,
                empresa_id: empresa.id,
            },
            include: [
                {
                    model: GridBanner,
                },
            ],
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

    async update(empresa: Empresas, id: string, body: GridBannerPageUpdateDto) {
        const { gridBannerService } = await this.show(empresa, id);
        cache.delete(
            `${empresa.slug}:grid_banner_pages:${gridBannerService.page_id}`
        );
        await gridBannerService.update({ ...body, empresa_id: empresa.id });
        return {
            success: true,
            message: "Editado correctamente gridBannerService",
        };
    }
}
