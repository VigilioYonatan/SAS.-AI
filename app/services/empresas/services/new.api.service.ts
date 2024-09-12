import { BadRequestException, Injectable } from "@vigilio/express-core";
import { NotFoundException } from "@vigilio/express-core";
import { New } from "../entities/new.entity";
import type { NewStoreDto } from "../dtos/new.store.dto";
import type { Empresas } from "../entities/empresas.entity";

@Injectable()
export class NewApiService {
	async index(empresa: Empresas) {
		const data = await New.findAll({
			where: {
				empresa_id: empresa.id,
			},
		});
		return {
			success: true,
			data,
		};
	}

	async show(empresa: Empresas, id: number) {
		const nuevo = await New.findOne({
			where: { id, empresa_id: empresa.id },
		});
		if (!nuevo) {
			throw new NotFoundException(`No se encontró un new con el id ${id}`);
		}
		return {
			success: true,
			nuevo,
		};
	}

	async store(empresa: Empresas, body: NewStoreDto) {
		const exist = await New.count({
			where: { empresa_id: empresa.id },
		});
		if (exist > 0) throw new BadRequestException("Ya hay new");
		const nuevo = new New({ ...body, empresa_id: empresa.id });
		await nuevo.save();
		return {
			success: true,
			nuevo,
		};
	}
	async update(empresa: Empresas, id: number, body: NewStoreDto) {
		const { nuevo } = await this.show(empresa, id);
		await nuevo.update(body);
		return {
			success: true,
			nuevo,
		};
	}

	async destroy(empresa: Empresas, id: number) {
		const { nuevo } = await this.show(empresa, id);
		// const new = await New.findByPk(id);
		await nuevo.destroy();
		return {
			success: true,
			message: "new eliminado",
		};
	}
}
