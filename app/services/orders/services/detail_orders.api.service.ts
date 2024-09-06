import { Injectable } from "@vigilio/express-core";
import { NotFoundException } from "@vigilio/express-core";
import { DetailOrders } from "../entities/detail_orders.entity";
import type { DetailOrdersStoreDto } from "../dtos/detail_orders.store.dto";
import type { DetailOrdersUpdateDto } from "../dtos/detail_orders.update.dto";
import type { InformationEntity } from "@/information/entities/information.entity";

@Injectable()
export class DetailOrdersApiService {
	async index(information: InformationEntity) {
		const data = await DetailOrders.findAll({
			where: {
				information_id: information.id,
			},
		});
		return {
			success: true,
			data,
		};
	}

	async show(information: InformationEntity, id: string) {
		let detailOrder = null;
		if (!Number.isNaN(Number(id))) {
			detailOrder = await DetailOrders.findOne({
				where: {
					information_id: information.id,
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

	async store(
		information: InformationEntity,
		detailOrdersStoreDto: DetailOrdersStoreDto,
	) {
		const detailOrder = new DetailOrders({
			...detailOrdersStoreDto,
			information_id: information.id,
		});
		await detailOrder.save();
		return {
			success: true,
			detailOrder,
		};
	}

	async update(
		information: InformationEntity,
		id: string,
		detailOrdersUpdateDto: DetailOrdersUpdateDto,
	) {
		const { detailOrder } = await this.show(information, id);
		await detailOrder.update(detailOrdersUpdateDto);
		return {
			success: true,
			detailOrder,
		};
	}

	async destroy(information: InformationEntity, id: string) {
		const { detailOrder } = await this.show(information, id);
		await detailOrder.destroy();
		return {
			success: true,
			message: `El orden con el id: ${id} fue eliminado`,
		};
	}
}
