import { Injectable } from "@vigilio/express-core";
import { NotFoundException } from "@vigilio/express-core";
import { Ratings } from "@/polymorphism/entities/ratings.entity";
import type { RatingsStoreDto } from "../dtos/ratings.store.dto";
import type { RatingsUpdateDto } from "../dtos/ratings.update.dto";
import type { Empresas } from "@/empresas/entities/empresas.entity";

@Injectable()
export class RatingsApiService {
	async index(
		empresa: Empresas,
		ratingsable_type: string,
		ratingsable_id: string,
	) {
		const ratings = await Ratings.findAll({
			where: {
				empresa_id: empresa.id,
				ratingsable_type,
				ratingsable_id,
			},
		});

		return {
			success: true,
			data: ratings,
		};
	}

	async show(
		empresa: Empresas,
		ratingsable_type: string,
		ratingsable_id: string,
		user_id: number,
	) {
		const rating = await Ratings.findOne({
			where: {
				ratingsable_type,
				ratingsable_id,
				user_id,
				empresa_id: empresa.id,
			},
		});

		if (!rating)
			throw new NotFoundException(
				`No se encontró un rating - ${ratingsable_type} con el id ${ratingsable_id}`,
			);
		return {
			success: true,
			rating,
		};
	}

	async store(
		empresa: Empresas,
		ratingsable_type: string,
		ratingsable_id: string,
		ratingsStoreDto: RatingsStoreDto,
		user_id: number,
	) {
		const rating = new Ratings({
			ratingsable_type,
			ratingsable_id: Number(ratingsable_id),
			rating: ratingsStoreDto.rating,
			user_id,
			empresa_id: empresa.id,
		});
		await rating.save();
		return {
			success: true,
			rating,
		};
	}

	async update(
		empresa: Empresas,
		ratingsable_type: string,
		ratingsable_id: string,
		ratingsUpdateDto: RatingsUpdateDto,
		user_id: number,
	) {
		const { rating } = await this.show(
			empresa,
			ratingsable_type,
			ratingsable_id,
			user_id,
		);

		await rating.update(ratingsUpdateDto);
		return {
			success: true,
			rating,
		};
	}

	async destroy(
		empresa: Empresas,
		ratingsable_type: string,
		ratingsable_id: string,
		user_id: number,
	) {
		const { rating } = await this.show(
			empresa,
			ratingsable_type,
			ratingsable_id,
			user_id,
		);

		await rating.destroy();
		return {
			success: true,
			message: `El rating de usuario id: ${user_id}  del ${ratingsable_type} con el id ${ratingsable_id} fue eliminado`,
		};
	}
}
