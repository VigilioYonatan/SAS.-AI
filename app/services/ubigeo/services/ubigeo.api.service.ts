import { Injectable, NotFoundException } from "@vigilio/express-core";

import { Regions } from "../entities/regions.entity";
import { Cities } from "../entities/cities.entity";
import type { Empresas } from "@/empresas/entities/empresas.entity";
import type { RegionsUpdateDto } from "../dtos/regions.update.dto";
import { RegionsEmpresa } from "../entities/regions_empresa.entity";
import { Countries } from "../entities/countries.entity";

@Injectable()
export class UbigeoApiService {
	async regions(empresa: Empresas) {
		const data = await Regions.findAll({
			include: [
				{
					model: Countries,
					where: {
						code: empresa.dial_code,
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
	async regionsShow(empresa: Empresas, id: string) {
		const data = await Regions.findOne({
			include: [
				{
					model: Countries,
					where: {
						code: empresa.dial_code,
					},
					required: true,
				},
			],
			where: { id },
		});
		if (!data) throw new NotFoundException("No se encontró region.");
		const regionEmpresa = await RegionsEmpresa.findOne({
			where: {
				empresa_id: empresa.id,
				region_id: data.id,
			},
		});
		data.dataValues.days = regionEmpresa?.days;
		data.dataValues.enabled = regionEmpresa?.enabled;
		data.dataValues.priceShipping = regionEmpresa?.priceShipping;
		return {
			success: true,
			data,
		};
	}
	async regionsUpdate(empresa: Empresas, id: string, body: RegionsUpdateDto) {
		const { data } = await this.regionsShow(empresa, id);
		await RegionsEmpresa.update(
			{
				priceShipping: body.priceShipping,
				enabled: body.enabled,
				days: body.days,
			},
			{
				where: {
					region_id: data.id,
					empresa_id: empresa.id,
				},
			},
		);
		return {
			success: true,
			message: "Se actualizó región correctamente.",
		};
	}

	async cities(empresa: Empresas) {
		const data = await Cities.findAll({
			include: [
				{
					model: Regions,
					required: true,
					include: [
						{
							model: Countries,
							where: {
								code: empresa.dial_code,
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
	async citiesShow(empresa: Empresas, id: number) {
		const data = await Cities.findOne({
			where: { id },
			include: [
				{
					model: Regions,
					include: [
						{
							model: Countries,
							where: {
								code: empresa.dial_code,
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
