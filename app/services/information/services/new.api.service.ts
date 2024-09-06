import { BadRequestException, Injectable } from "@vigilio/express-core";
import { NotFoundException } from "@vigilio/express-core";
import { New } from "../entities/new.entity";
import type { NewStoreDto } from "../dtos/new.store.dto";
import type { InformationEntity } from "../entities/information.entity";

@Injectable()
export class NewApiService {
	async index(information: InformationEntity) {
		const data = await New.findAll({
			where: {
				information_id: information.id,
			},
		});
		return {
			success: true,
			data,
		};
	}

	async show(information: InformationEntity, id: number) {
		const nuevo = await New.findOne({
			where: { id, information_id: information.id },
		});
		if (!nuevo) {
			throw new NotFoundException(`No se encontró un new con el id ${id}`);
		}
		return {
			success: true,
			nuevo,
		};
	}

	async store(information: InformationEntity, body: NewStoreDto) {
		const exist = await New.count({
			where: { information_id: information.id },
		});
		if (exist > 0) throw new BadRequestException("Ya hay new");
		const nuevo = new New({ ...body, information_id: information.id });
		await nuevo.save();
		return {
			success: true,
			nuevo,
		};
	}
	async update(information: InformationEntity, id: number, body: NewStoreDto) {
		const { nuevo } = await this.show(information, id);
		await nuevo.update(body);
		return {
			success: true,
			nuevo,
		};
	}

	async destroy(information: InformationEntity, id: number) {
		const { nuevo } = await this.show(information, id);
		// const new = await New.findByPk(id);
		await nuevo.destroy();
		return {
			success: true,
			message: "new eliminado",
		};
	}
}
