import { Injectable } from "@vigilio/express-core";
import {
	Body,
	Controller,
	Delete,
	Get,
	Params,
	Post,
	Put,
	Query,
	Req,
	Status,
} from "@vigilio/express-core";
import { Pipe, Validator } from "@vigilio/express-core/valibot";
import { custom, objectAsync, string } from "@vigilio/valibot";
import { PermissionAuth } from "@/auth/guards/permission-auth.guard";
import type { Request } from "express";
import { commentsEntities, type CommentsEntities } from "../libs";
import { SubcommentsApiService } from "../services/subcomments.api.service";
import {
	subcommentsStoreDto,
	type SubcommentsStoreDto,
} from "../dtos/subcomments.store.dto";
import {
	subcommentsUpdateDto,
	type SubcommentsUpdateDto,
} from "../dtos/subcomments.update.dto";
import type { Users } from "@/users/entities/users.entity";
import type { Empresas } from "@/empresas/entities/empresas.entity";
import type { RequestVigilio } from "~/config/types";

@Injectable()
@Controller("/comments")
export class SubcommentsApiController {
	constructor(private readonly subcommentsApiService: SubcommentsApiService) {}

	@Pipe(
		objectAsync({
			commentables_type: string([
				custom(
					(val) => commentsEntities.includes(val as CommentsEntities),
					"entidad no válida",
				),
			]),
			commentables_id: string(),
			subcommentables_id: string(),
		}),
	)
	@Get("/:commentables_type/:commentables_id/subcomments/:subcommentables_id")
	async index(
		@Params("commentables_type")
		commentables_type: CommentsEntities,
		@Params("commentables_id") commentables_id: string,
		@Params("subcommentables_id") subcommentables_id: string,
		@Query() query: { offset: number; limit: number },
		@Req("empresa") empresa: Empresas,
	) {
		const result = await this.subcommentsApiService.index(
			empresa,
			commentables_type,
			commentables_id,
			subcommentables_id,
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
			subcommentables_id: string(),
			id: string(),
		}),
	)
	@Get(
		"/:commentables_type/:commentables_id/subcomments/:subcommentables_id/:id",
	)
	async show(
		@Params("commentables_type") commentables_type: string,
		@Params("commentables_id") commentables_id: string,
		@Params("subcommentables_id") subcommentables_id: string,
		@Params("id") id: string,
		@Req("empresa") empresa: Empresas,
	) {
		const result = await this.subcommentsApiService.show(
			empresa,
			commentables_type,
			commentables_id,
			subcommentables_id,
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
			subcommentables_id: string(),
		}),
	)
	@PermissionAuth()
	@Validator(subcommentsStoreDto)
	@Status(201)
	@Post("/:commentables_type/:commentables_id/subcomments/:subcommentables_id")
	async store(
		@Params("commentables_type") commentables_type: string,
		@Params("commentables_id") commentables_id: string,
		@Params("subcommentables_id") subcommentables_id: string,
		@Body() body: SubcommentsStoreDto,
		@Req() req: Request & { user: Users },
		@Req("empresa") empresa: Empresas,
	) {
		const result = await this.subcommentsApiService.store(
			empresa,
			commentables_type,
			commentables_id,
			subcommentables_id,
			body,
			req.user.id,
		);
		return result;
	}

	@PermissionAuth()
	@Validator(subcommentsUpdateDto)
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
			subcommentables_id: string(),
			id: string(),
		}),
	)
	@Put(
		"/:commentables_type/:commentables_id/subcomments/:subcommentables_id/:id",
	)
	async update(
		@Params("commentables_type") commentables_type: string,
		@Params("commentables_id") commentables_id: string,
		@Params("subcommentables_id") subcommentables_id: string,
		@Params("id") id: string,
		@Body() body: SubcommentsUpdateDto,
		@Req() req: RequestVigilio,
	) {
		const result = await this.subcommentsApiService.update(
			req.empresa,
			commentables_type,
			commentables_id,
			subcommentables_id,
			id,
			body,
			req.user.id,
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
			subcommentables_id: string(),
			id: string(),
		}),
	)
	@Delete(
		"/:commentables_type/:commentables_id/subcomments/:subcommentables_id/:id",
	)
	async destroy(
		@Params("commentables_type") commentables_type: string,
		@Params("commentables_id") commentables_id: string,
		@Params("subcommentables_id") subcommentables_id: string,
		@Params("id") id: string,
		@Req() req: RequestVigilio,
	) {
		const result = await this.subcommentsApiService.destroy(
			req.empresa,
			commentables_type,
			commentables_id,
			subcommentables_id,
			id,
			req.user.id,
		);
		return result;
	}
}
