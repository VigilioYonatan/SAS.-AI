import { Injectable, NotFoundException } from "@vigilio/express-core";
import type { InformationEntity } from "../entities/information.entity";
import { Settings } from "../entities/settings.entity";
import type { SettingsUpdateDto } from "../dtos/settings.update.dto";

@Injectable()
export class SettingsApiService {
	async index(information: InformationEntity) {
		const data = await Settings.findOne({
			where: {
				information_id: information.id,
			},
		});
		if (!data) throw new NotFoundException("no se encontró settings");
		return {
			success: true,
			data,
		};
	}

	async update(information: InformationEntity, body: SettingsUpdateDto) {
		const { data } = await this.index(information);
		await data.update(body);
		return {
			success: true,
			message: "Actualizado correctamente",
		};
	}
}
