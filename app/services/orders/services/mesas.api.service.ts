import { Injectable } from "@vigilio/express-core";
import { NotFoundException } from "@vigilio/express-core/handler";
import { Mesas } from "../entities/mesas.entity";
import { Orders } from "../entities/orders.entity";
import { StatusOrders } from "../entities/status_orders.entity";
import type { OrdersSchema } from "../schemas/orders.schema";
import type { MesasStoreDto } from "../dtos/mesas.store.dto";
import type { InformationEntity } from "@/information/entities/information.entity";

@Injectable()
export class MesasApiService {
	async index(information: InformationEntity) {
		const data = await Mesas.findAll({
			where: {
				information_id: information.id,
			},
		});
		return {
			success: true,
			data,
		};
	}
	async orders(information: InformationEntity, floor_id: string) {
		const data = await Mesas.findAll({
			include: [
				{
					model: Orders,
					include: [
						{
							model: StatusOrders,
							where: {
								id: [1, 2], //solo los que estan confirmados y preparados
							},
						},
					],
					attributes: [
						"id",
						"order_code",
						"status_order_id",
					] as (keyof OrdersSchema)[],
				},
			],
			order: [["createdAt", "ASC"]],
			where: {
				floor_id,
				information_id: information.id,
			},
		});

		return {
			success: true,
			data,
		};
	}
	async show(information: InformationEntity, id: string) {
		let mesa = null;
		if (!Number.isNaN(Number(id))) {
			mesa = await Mesas.findOne({
				where: { id, information_id: information.id },
			});
		}
		if (!mesa) {
			throw new NotFoundException(`No se encontró una mesa con ${id}`);
		}
		return {
			success: true,
			mesa,
		};
	}

	async store(information: InformationEntity, body: MesasStoreDto) {
		const mesa = new Mesas({ ...body, information_id: information.id });
		const latestUser = await Mesas.findOne({
			order: [["id", "DESC"]],
			where: { floor_id: body.floor_id, information_id: information.id },
		});
		let code = null;
		if (latestUser) {
			const ultimoNumero = Number.parseInt(latestUser.mesa_code.split("-")[1]);
			code = `MESA-${String(ultimoNumero + 1).padStart(6, "0")}`;
		} else {
			code = "MESA-000001";
		}
		mesa.mesa_code = code;
		await mesa.save();
		return {
			success: true,
			mesa,
		};
	}

	async destroy(information: InformationEntity, id: string) {
		const { mesa } = await this.show(information, id);
		await mesa.destroy();
		return {
			success: true,
			message: `La mesa con el id: ${id} fue eliminado`,
		};
	}
}
