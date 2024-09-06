import { Injectable } from "@vigilio/express-core";
import { NotFoundException } from "@vigilio/express-core";
import { DetailOrders } from "../entities/detail_orders.entity";
import type { DetailOrdersStoreDto } from "../dtos/detail_orders.store.dto";
import type { DetailOrdersUpdateDto } from "../dtos/detail_orders.update.dto";
import type { Empresas } from "@/empresas/entities/empresas.entity";

@Injectable()
export class DetailOrdersApiService {
    async index(empresa: Empresas) {
        const data = await DetailOrders.findAll({
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
        let detailOrder = null;
        if (!Number.isNaN(Number(id))) {
            detailOrder = await DetailOrders.findOne({
                where: {
                    empresa_id: empresa.id,
                    id,
                },
            });
        }
        if (!detailOrder) {
            throw new NotFoundException(`No se encontró un orden con ${id}`);
        }
        return {
            success: true,
            detailOrder,
        };
    }

    async store(empresa: Empresas, detailOrdersStoreDto: DetailOrdersStoreDto) {
        const detailOrder = new DetailOrders({
            ...detailOrdersStoreDto,
            empresa_id: empresa.id,
        });
        await detailOrder.save();
        return {
            success: true,
            detailOrder,
        };
    }

    async update(
        empresa: Empresas,
        id: string,
        detailOrdersUpdateDto: DetailOrdersUpdateDto
    ) {
        const { detailOrder } = await this.show(empresa, id);
        await detailOrder.update(detailOrdersUpdateDto);
        return {
            success: true,
            detailOrder,
        };
    }

    async destroy(empresa: Empresas, id: string) {
        const { detailOrder } = await this.show(empresa, id);
        await detailOrder.destroy();
        return {
            success: true,
            message: `El orden con el id: ${id} fue eliminado`,
        };
    }
}
