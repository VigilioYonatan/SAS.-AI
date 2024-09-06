import { Injectable } from "@vigilio/express-core";
import { Clients } from "../entities/clients.entity";
import { NotFoundException } from "@vigilio/express-core";
import { type ClientsStoreDto } from "../dtos/clients.store.dto";
import type { InformationEntity } from "@/information/entities/information.entity";

@Injectable()
export class ClientsApiService {
	async index(information: InformationEntity) {
		const data = await Clients.findAll({
			where: {
				information_id: information.id,
			},
		});
		return {
			success: true,
			data,
		};
	}

	async show(information: InformationEntity, telephone: string) {
		const client = await Clients.findOne({
			where: {
				telephone: telephone,
				information_id: information.id,
			},
		});
		if (!client) {
			throw new NotFoundException(`No se encontró un usuario con ${telephone}`);
		}
		return {
			success: true,
			client,
		};
	}

	async store(
		information: InformationEntity,
		clientsStoreDto: ClientsStoreDto,
	) {
		const client = new Clients({
			...clientsStoreDto,
			information_id: information.id,
		});

		await client.save();

		return {
			success: true,
			client,
		};
	}

	async update(
		information: InformationEntity,
		id: string,
		clientsUpdateDto: ClientsStoreDto,
	) {
		const { client } = await this.show(information, id);
		await client.update(clientsUpdateDto);
		return {
			success: true,
			client,
		};
	}

	async destroy(information: InformationEntity, id: string) {
		const { client } = await this.show(information, id);

		await client.destroy();

		return {
			success: true,
			message: `El usuario con el id: ${id} fue eliminado`,
		};
	}
}
