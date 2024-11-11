import { Injectable } from "@vigilio/express-core";
import { BadRequestException, NotFoundException } from "@vigilio/express-core";
import type { CommentsUpdateDto } from "@/polymorphism/dtos/comments.update.dto";
import type { CommentsStoreDto } from "@/polymorphism/dtos/comments.store.dto";
import { Comments } from "@/polymorphism/entities/comments.entity";
import { Subcomments } from "../entities/subcomments.entity";
import type { Empresas } from "@/empresas/entities/empresas.entity";

@Injectable()
export class CommentsApiService {
	async index(
		empresa: Empresas,
		commentsable_type: string,
		commentsable_id: string,
		query: {
			offset: number;
			limit: number;
		},
	) {
		const { limit = 20, offset = 0 } = query || { limit: 20, offset: 0 };
		const offsetConverted = Number(offset);
		const limitConverted = Number(limit);
		const result = await Promise.all([
			Comments.findAll({
				offset: offsetConverted,
				limit: limitConverted,
				where: {
					commentsable_type,
					empresa_id: empresa.id,
					commentsable_id,
				},
				order: [["createdAt", "DESC"]],
			}),
			Comments.count({
				where: {
					commentsable_type,
					commentsable_id,
					empresa_id: empresa.id,
				},
			}),
		]);

		const results = await Promise.all(
			result[0].map(async (comment) => {
				const [count, reactions] = await Promise.all([
					Subcomments.count({
						where: { comment_id: comment.id },
					}),
					comment.$get("reactions", {
						attributes: ["id", "user_id", "isLike"],
					}),
				]);
				return {
					...comment.toJSON(),
					count,
					reactions,
				};
			}),
		);

		return {
			success: true,
			count: result[1],
			results,
		};
	}

	async show(
		empresa: Empresas,
		commentsable_type: string,
		commentsable_id: string,
		id: string,
	) {
		const comment = await Comments.findOne({
			where: {
				commentsable_type,
				commentsable_id,
				empresa_id: empresa.id,
				id,
			},
		});
		if (!comment)
			throw new NotFoundException(
				`No se encontró comentario con el id ${id} del ${commentsable_type} con el id ${commentsable_id}`,
			);
		const count = await Subcomments.count({
			where: { comment_id: comment.id },
		});
		return {
			success: true,
			comment,
			count,
		};
	}

	async store(
		empresa: Empresas,
		commentsable_type: string,
		commentsable_id: string,
		commentsStoreDto: CommentsStoreDto,
		user_id: number,
	) {
		const comment = new Comments({
			commentsable_type,
			commentsable_id: Number(commentsable_id),
			content: commentsStoreDto.content,
			user_id,
			empresa_id: empresa.id,
		});
		await comment.save();
		return {
			success: true,
			comment,
		};
	}

	async update(
		empresa: Empresas,
		commentsable_type: string,
		commentsable_id: string,
		id: string,
		commentsUpdateDto: CommentsUpdateDto,
		user_id: number,
	) {
		const { comment } = await this.show(
			empresa,
			commentsable_type,
			commentsable_id,
			id,
		);
		if (user_id !== comment.user_id)
			throw new BadRequestException("No está permitido a relizar esta acción");
		await comment.update(commentsUpdateDto);
		return {
			success: true,
			comment,
		};
	}

	async destroy(
		empresa: Empresas,
		commentsable_type: string,
		commentsable_id: string,
		id: string,
		user_id: number,
	) {
		const { comment } = await this.show(
			empresa,
			commentsable_type,
			commentsable_id,
			id,
		);
		if (user_id !== comment.user_id)
			throw new BadRequestException("No está permitido a relizar esta acción");
		await comment.destroy();
		return {
			success: true,
			message: `El comentario con el id: ${id}  del ${commentsable_type} con el id ${commentsable_id} fue eliminado`,
		};
	}
}
