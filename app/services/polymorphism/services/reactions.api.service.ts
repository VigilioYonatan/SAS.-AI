import { Injectable } from "@vigilio/express-core";
import { BadRequestException, NotFoundException } from "@vigilio/express-core";
import { Reactions } from "@/polymorphism/entities/reactions.entity";
import type { ReactionsStoreDto } from "../dtos/reactions.store.dto";
import type { ReactionsUpdateDto } from "../dtos/reactions.update.dto";
import type { Empresas } from "@/empresas/entities/empresas.entity";

@Injectable()
export class ReactionsApiService {
	async index(
		empresa: Empresas,
		reactionsable_type: string,
		reactionsable_id: string,
	) {
		const reactions = await Reactions.findAll({
			where: {
				reactionsable_type,
				reactionsable_id,
				empresa_id: empresa.id,
			},
		});

		return {
			success: true,
			data: reactions,
		};
	}

	async show(
		empresa: Empresas,
		reactionsable_type: string,
		reactionsable_id: string,
		id: string,
	) {
		const reaction = await Reactions.findOne({
			where: {
				reactionsable_type,
				reactionsable_id,
				id,
				empresa_id: empresa.id,
			},
		});

		if (!reaction)
			throw new NotFoundException(
				`No se encontró un comentario con el id ${id} del ${reactionsable_type} con el id ${reactionsable_id}`,
			);
		return {
			success: true,
			reaction,
		};
	}

	async store(
		empresa: Empresas,
		reactionsable_type: string,
		reactionsable_id: string,
		reactionsStoreDto: ReactionsStoreDto,
		user_id: number,
	) {
		const reaction = new Reactions({
			reactionsable_type,
			reactionsable_id: Number(reactionsable_id),
			isLike: reactionsStoreDto.isLike,
			user_id,
			empresa_id: empresa.id,
		});
		await reaction.save();
		return {
			success: true,
			reaction,
		};
	}

	async update(
		empresa: Empresas,
		reactionsable_type: string,
		reactionsable_id: string,
		id: string,
		reactionsUpdateDto: ReactionsUpdateDto,
		user_id: number,
	) {
		const { reaction } = await this.show(
			empresa,
			reactionsable_type,
			reactionsable_id,
			id,
		);
		if (user_id !== reaction.user_id)
			throw new BadRequestException("No está permitido a relizar esta acción");
		await reaction.update(reactionsUpdateDto);
		return {
			success: true,
			reaction,
		};
	}

	async destroy(
		empresa: Empresas,
		reactionsable_type: string,
		reactionsable_id: string,
		id: string,
		user_id: number,
	) {
		const { reaction } = await this.show(
			empresa,
			reactionsable_type,
			reactionsable_id,
			id,
		);
		if (user_id !== reaction.user_id)
			throw new BadRequestException("No está permitido a relizar esta acción");
		await reaction.destroy();
		return {
			success: true,
			message: `La reacción con el id: ${id}  del ${reactionsable_type} con el id ${reactionsable_id} fue eliminado`,
		};
	}
}
