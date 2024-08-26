import { BadRequestException, Injectable } from "@vigilio/express-core";
import { NotFoundException } from "@vigilio/express-core";
import { New } from "../entities/new.entity";
import type { NewStoreDto } from "../dtos/new.store.dto";

@Injectable()
export class NewApiService {
	async index() {
		const data = await New.findAll();
		return {
			success: true,
			data,
		};
	}

	async show(id: number) {
		const nuevo = await New.findByPk(id);
		if (!nuevo) {
			throw new NotFoundException(`No se encontró un new con el id ${id}`);
		}
		return {
			success: true,
			nuevo,
		};
	}

	async store(body: NewStoreDto) {
		const exist = await New.count();
		if (exist > 0) throw new BadRequestException("Ya hay new");
		const nuevo = new New(body);
		await nuevo.save();
		return {
			success: true,
			nuevo,
		};
	}
	async update(id: number, body: NewStoreDto) {
		const { nuevo } = await this.show(id);
		await nuevo.update(body);
		return {
			success: true,
			nuevo,
		};
	}

	async destroy(id: number) {
		const { nuevo } = await this.show(id);
		// const new = await New.findByPk(id);
		await nuevo.destroy();
		return {
			success: true,
			message: "new eliminado",
		};
	}
}
