import { Injectable } from "@vigilio/express-core";
import { BadRequestException, NotFoundException } from "@vigilio/express-core";
import type { SubcommentsUpdateDto } from "@/polymorphism/dtos/subcomments.update.dto";
import type { SubcommentsStoreDto } from "../dtos/subcomments.store.dto";
import { Subcomments } from "../entities/subcomments.entity";
import { CommentsApiService } from "@/polymorphism/services/comments.api.service";
import type { Empresas } from "@/empresas/entities/empresas.entity";

@Injectable()
export class SubcommentsApiService {
	constructor(private readonly commentsApiService: CommentsApiService) {}
	async index(
		empresa: Empresas,
		commentsable_type: string,
		commentsable_id: string,
		subcommentables_id: string,
		query: {
			offset: number;
			limit: number;
		},
	) {
		const { limit = 20, offset = 0 } = query || {
			limit: 20,
			offset: 0,
		};
		const offsetConverted = Number(offset);
		const limitConverted = Number(limit);
		const { comment } = await this.commentsApiService.show(
			empresa,
			commentsable_type,
			commentsable_id,
			subcommentables_id,
		);

		const [results, count] = await Promise.all([
			comment.$get("subcomments", {
				offset: offsetConverted,
				limit: limitConverted,
				order: [["createdAt", "DESC"]],
			}),
			Subcomments.count({
				where: { comment_id: comment.id, empresa_id: empresa.id },
			}),
		]);

		const mappedSubcomments = await Promise.all(
			results.map(async (sub) => {
				const reactions = await (sub as Subcomments).$get("reactions", {
					attributes: ["id", "user_id", "isLike"],
				});
				return {
					...(sub as Subcomments).toJSON(),
					reactions,
				};
			}),
		);

		return {
			success: true,
			count,
			results: mappedSubcomments,
		};
	}

	async show(
		empresa: Empresas,
		commentsable_type: string,
		commentsable_id: string,
		subcommentables_id: string,
		id: string,
	) {
		const { comment } = await this.commentsApiService.show(
			empresa,
			commentsable_type,
			commentsable_id,
			subcommentables_id,
		);
		const subcommentary = (await comment.$get("subcomments", {
			where: { id },
		})) as Subcomments[];
		if (!subcommentary[0])
			throw new NotFoundException(
				`No se encontró subcomentario con el id ${id} del ${commentsable_type} con el id ${commentsable_id}`,
			);
		return {
			success: true,
			subcomment: subcommentary[0],
		};
	}

	async store(
		empresa: Empresas,
		commentsable_type: string,
		commentsable_id: string,
		subcommentables_id: string,
		subcommentsStoreDto: SubcommentsStoreDto,
		user_id: number,
	) {
		const { comment } = await this.commentsApiService.show(
			empresa,
			commentsable_type,
			commentsable_id,
			subcommentables_id,
		);

		const subcomment = await comment.$create("subcomment", {
			...subcommentsStoreDto,
			subcommentsable_id: commentsable_id,
			subcommentsable_type: commentsable_type,
			user_id,
			empresa_id: empresa.id,
		});
		return {
			success: true,
			subcomment,
		};
	}

	async update(
		empresa: Empresas,
		commentsable_type: string,
		commentsable_id: string,
		subcommentables_id: string,
		id: string,
		subcommentsUpdateDto: SubcommentsUpdateDto,
		user_id: number,
	) {
		const { subcomment } = await this.show(
			empresa,
			commentsable_type,
			commentsable_id,
			subcommentables_id,
			id,
		);
		if (user_id !== subcomment.user_id)
			throw new BadRequestException("No está permitido a relizar esta acción");
		await subcomment.update(subcommentsUpdateDto);
		return {
			success: true,
			subcomment,
		};
	}

	async destroy(
		empresa: Empresas,
		commentsable_type: string,
		commentsable_id: string,
		subcommentables_id: string,
		id: string,
		user_id: number,
	) {
		const { subcomment } = await this.show(
			empresa,
			commentsable_type,
			commentsable_id,
			subcommentables_id,
			id,
		);
		if (user_id !== subcomment.user_id)
			throw new BadRequestException("No está permitido a relizar esta acción");
		await subcomment.destroy();
		return {
			success: true,
			message: `El subcomentario con el id: ${id}  del ${commentsable_type} con el id ${commentsable_id} fue eliminado`,
		};
	}
}
