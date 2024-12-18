import { Injectable } from "@vigilio/express-core";
import { NotFoundException } from "@vigilio/express-core";
import { Empresas } from "../entities/empresas.entity";
import type { GridBannerServiceUpdateDto } from "../dtos/grid_banner_service.update.dto";
import { GridBanner } from "../entities/grid_banner.entity";
import { GridBannerShop } from "../entities/grid_banner_shop.entity";

@Injectable()
export class GridBannerShopApiService {
    async index(empresa: Empresas) {
        const data = await GridBannerShop.findAll({
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
        const gridBannerShop = await GridBannerShop.findOne({
            where: {
                id,
                empresa_id: empresa.id,
            },
        });
        if (!gridBannerShop) {
            throw new NotFoundException(
                `No se encontró un reclamo con el id ${id}`
            );
        }
        return {
            success: true,
            gridBannerShop,
        };
    }

    async update(
        empresa: Empresas,
        id: string,
        body: GridBannerServiceUpdateDto
    ) {
        const { gridBannerShop } = await this.show(empresa, id);
        await gridBannerShop.update({ ...body, empresa_id: empresa.id });
        return {
            success: true,
            message: "Editado correctamente gridBanner Shop",
        };
    }
}
