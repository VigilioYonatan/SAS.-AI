import { Injectable } from "@vigilio/express-core";
import { Floors } from "../entities/floors.entity";
import { BadRequestException, NotFoundException } from "@vigilio/express-core";

import { Op } from "sequelize";
import type { FloorsStoreDto } from "../dtos/floors.store.dto";
import type { FloorsUpdateDto } from "../dtos/floors.update.dto";
import type { InformationEntity } from "@/information/entities/information.entity";

@Injectable()
export class FloorsApiService {
	async index(information: InformationEntity) {
		const data = await Floors.findAll({
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
		const floor = await Floors.findOne({
			where: {
				id,
				information_id: information.id,
			},
		});
		if (!floor) throw new NotFoundException(`No se encontró piso ${id}`);
		return {
			success: true,
			floor,
		};
	}
	async mesas(information: InformationEntity, id: string) {
		const { floor } = await this.show(information, id);
		const data = await floor.$get("mesas");
		return {
			success: true,
			data,
		};
	}

	async store(information: InformationEntity, body: FloorsStoreDto) {
		const floor = new Floors({ ...body, information_id: information.id });
		await floor.save();
		return {
			success: true,
			floor,
		};
	}
	async update(
		information: InformationEntity,
		id: string,
		body: FloorsUpdateDto,
	) {
		const { floor } = await this.show(information, id);
		const [byName] = await Promise.all([
			Floors.findOne({
				where: {
					name: body.name,
					information_id: information.id,
					id: { [Op.not]: id },
				},
				raw: true,
			}),
		]);

		if (byName) {
			throw new BadRequestException(
				`Ya existe ese nombre para el floor ${body.name}`,
			);
		}
		await floor.update(body);
		return {
			success: true,
			floor,
		};
	}
	async destroy(information: InformationEntity, id: string) {
		const { floor } = await this.show(information, id);
		await floor.destroy();
		return {
			success: true,
			message: `Eliminado floor correctamente ${id}`,
		};
	}
}
