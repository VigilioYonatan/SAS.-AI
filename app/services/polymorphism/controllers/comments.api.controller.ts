import { Injectable, Req } from "@vigilio/express-core";
import {
	Body,
	Controller,
	Delete,
	Get,
	Params,
	Post,
	Put,
	Query,
	Status,
} from "@vigilio/express-core";
import { Pipe, Validator } from "@vigilio/express-core/valibot";
import { custom, objectAsync, string } from "@vigilio/valibot";
import {
	commentsStoreDto,
	type CommentsStoreDto,
} from "@/polymorphism/dtos/comments.store.dto";
import {
	commentsUpdateDto,
	type CommentsUpdateDto,
} from "@/polymorphism/dtos/comments.update.dto";
import { PermissionAuth } from "@/auth/guards/permission-auth.guard";
import { CommentsApiService } from "../services/comments.api.service";
import { commentsEntities, type CommentsEntities } from "../libs";
import { Users } from "@/users/entities/users.entity";
import type { Empresas } from "@/empresas/entities/empresas.entity";

@Injectable()
@Controller("/comments")
export class CommentsApiController {
	constructor(private readonly commentsApiService: CommentsApiService) {}

	@Pipe(
		objectAsync({
			commentables_type: string([
				custom(
					(val) => commentsEntities.includes(val as CommentsEntities),
					"entidad no válida",
				),
			]),
			commentables_id: string(),
		}),
	)
	@Get("/:commentables_type/:commentables_id")
	async index(
		@Params("commentables_type") commentables_type: CommentsEntities,
		@Params("commentables_id") commentables_id: string,
		@Query() query: { offset: number; limit: number },
		@Req("empresa") empresa: Empresas,
	) {
		const result = await this.commentsApiService.index(
			empresa,
			commentables_type,
			commentables_id,
			query,
		);
		return result;
	}

	@Pipe(
		objectAsync({
			commentables_type: string([
				custom(
					(val) => commentsEntities.includes(val as CommentsEntities),
					"entidad no válida",
				),
			]),
			commentables_id: string(),
			id: string(),
		}),
	)
	@Get("/:commentables_type/:commentables_id/:id")
	async show(
		@Params("commentables_type") commentables_type: string,
		@Params("commentables_id") commentables_id: string,
		@Params("id") id: string,
		@Req("empresa") empresa: Empresas,
	) {
		const result = await this.commentsApiService.show(
			empresa,
			commentables_type,
			commentables_id,
			id,
		);
		return result;
	}

	@Pipe(
		objectAsync({
			commentables_type: string([
				custom(
					(val) => commentsEntities.includes(val as CommentsEntities),
					"entidad no válida",
				),
			]),
			commentables_id: string(),
		}),
	)
	@PermissionAuth()
	@Validator(commentsStoreDto)
	@Status(201)
	@Post("/:commentables_type/:commentables_id")
	async store(
		@Params("commentables_type") commentables_type: string,
		@Params("commentables_id") commentables_id: string,
		@Body() body: CommentsStoreDto,
		@Req("empresa") empresa: Empresas,
		@Req("user") user: Users,
	) {
		const result = await this.commentsApiService.store(
			empresa,
			commentables_type,
			commentables_id,
			body,
			user.id!,
		);
		return result;
	}

	@PermissionAuth()
	@Validator(commentsUpdateDto)
	@Status(201)
	@Pipe(
		objectAsync({
			commentables_type: string([
				custom(
					(val) => commentsEntities.includes(val as CommentsEntities),
					"entidad no válida",
				),
			]),
			commentables_id: string(),
			id: string(),
		}),
	)
	@Put("/:commentables_type/:commentables_id/:id")
	async update(
		@Params("commentables_type") commentables_type: string,
		@Params("commentables_id") commentables_id: string,
		@Params("id") id: string,
		@Body() body: CommentsUpdateDto,
		@Req("user") user: Users,
		@Req("empresa") empresa: Empresas,
	) {
		const result = await this.commentsApiService.update(
			empresa,
			commentables_type,
			commentables_id,
			id,
			body,
			user.id!,
		);
		return result;
	}

	@PermissionAuth()
	@Status(201)
	@Pipe(
		objectAsync({
			commentables_type: string([
				custom(
					(val) => commentsEntities.includes(val as CommentsEntities),
					"entidad no válida",
				),
			]),
			commentables_id: string(),
			id: string(),
		}),
	)
	@Delete("/:commentables_type/:commentables_id/:id")
	async destroy(
		@Params("commentables_type") commentables_type: string,
		@Params("commentables_id") commentables_id: string,
		@Params("id") id: string,
		@Req("user") user: Users,
		@Req("empresa") empresa: Empresas,
	) {
		const result = await this.commentsApiService.destroy(
			empresa,
			commentables_type,
			commentables_id,
			id,
			user.id!,
		);
		return result;
	}
}
