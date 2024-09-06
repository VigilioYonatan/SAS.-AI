import { Injectable } from "@vigilio/express-core";
import { NotFoundException } from "@vigilio/express-core";
import { Complaints } from "../entities/complaints.entity";
import type { ComplaintsStoreDto } from "../dtos/complaints.store.dto";
import type { InformationEntity } from "../entities/information.entity";

@Injectable()
export class ComplaintsApiService {
	async index(information: InformationEntity) {
		const data = await Complaints.findAll({
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
		const complaint = await Complaints.findOne({
			where: { id, information_id: information.id },
		});
		if (!complaint) {
			throw new NotFoundException(`No se encontró un reclamo con el id ${id}`);
		}
		return {
			success: true,
			complaint,
		};
	}

	async store(information: InformationEntity, body: ComplaintsStoreDto) {
		const complaint = new Complaints({
			...body,
			information_id: information.id,
		});
		await complaint.save();
		return {
			success: true,
			complaint,
		};
	}

	async destroy(information: InformationEntity, id: number) {
		const { complaint } = await this.show(information, id);
		// const complaint = await Complaints.findByPk(id);
		await complaint.destroy();
		return {
			success: true,
			message: "Reclamo eliminado",
		};
	}
}
