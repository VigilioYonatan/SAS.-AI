import { Injectable, NotFoundException } from "@vigilio/express-core";
import type { Empresas } from "../entities/empresas.entity";
import { Settings } from "../entities/settings.entity";
import type { SettingsUpdateDto } from "../dtos/settings.update.dto";

@Injectable()
export class SettingsApiService {
	async index(empresa: Empresas) {
		const data = await Settings.findOne({
			where: {
				empresa_id: empresa.id,
			},
		});
		if (!data) throw new NotFoundException("no se encontró settings");
		return {
			success: true,
			data,
		};
	}

	async update(empresa: Empresas, body: SettingsUpdateDto) {
		const { data } = await this.index(empresa);
		await data.update(body);
		return {
			success: true,
			message: "Actualizado correctamente",
		};
	}
}
