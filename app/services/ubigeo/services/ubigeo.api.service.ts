import { Injectable, NotFoundException } from "@vigilio/express-core";

import { Regions } from "../entities/regions.entity";
import { Cities } from "../entities/cities.entity";
import type { InformationEntity } from "@/information/entities/information.entity";
import type { RegionsUpdateDto } from "../dtos/regions.update.dto";
import { RegionsEmpresa } from "../entities/regions_empresa.entity";
import { Countries } from "../entities/countries.entity";

@Injectable()
export class UbigeoApiService {
	async regions(information: InformationEntity) {
		const data = await Regions.findAll({
			include: [
				{
					model: Countries,
					where: {
						code: information.dial_code,
					},
					required: true,
				},
			],
		});
		return {
			success: true,
			data,
		};
	}
	async regionsShow(information: InformationEntity, id: string) {
		const data = await Regions.findOne({
			include: [
				{
					model: Countries,
					where: {
						code: information.dial_code,
					},
					required: true,
				},
			],
			where: { id },
		});
		if (!data) throw new NotFoundException("No se encontró region.");
		const empresa = await RegionsEmpresa.findOne({
			where: {
				information_id: information.id,
				region_id: data.id,
			},
		});
		data.dataValues.days = empresa?.days;
		data.dataValues.enabled = empresa?.enabled;
		data.dataValues.priceShipping = empresa?.priceShipping;
		return {
			success: true,
			data,
		};
	}
	async regionsUpdate(
		information: InformationEntity,
		id: string,
		body: RegionsUpdateDto,
	) {
		const { data } = await this.regionsShow(information, id);
		await RegionsEmpresa.update(
			{
				priceShipping: body.priceShipping,
				enabled: body.enabled,
				days: body.days,
			},
			{
				where: {
					region_id: data.id,
					information_id: information.id,
				},
			},
		);
		return {
			success: true,
			message: "Se actualizó región correctamente.",
		};
	}

	async cities(information: InformationEntity) {
		const data = await Cities.findAll({
			include: [
				{
					model: Regions,
					required: true,
					include: [
						{
							model: Countries,
							where: {
								code: information.dial_code,
							},
							required: true,
						},
					],
				},
			],
		});

		return {
			success: true,
			data,
		};
	}
	async citiesShow(information: InformationEntity, id: number) {
		const data = await Cities.findOne({
			where: { id },
			include: [
				{
					model: Regions,
					include: [
						{
							model: Countries,
							where: {
								code: information.dial_code,
							},
							required: true,
						},
					],
					required: true,
				},
			],
		});
		if (!data) throw new NotFoundException(`No se encontró ciudad ${id}`);
		return {
			success: true,
			data,
		};
	}
}
