import { Injectable } from "@vigilio/express-core";
import {
	Body,
	Controller,
	Delete,
	Get,
	Params,
	Post,
	Put,
	Req,
	Status,
} from "@vigilio/express-core";
import { Pipe, Validator } from "@vigilio/express-core/valibot";
import { custom, objectAsync, string } from "@vigilio/valibot";
import { PermissionAuth } from "@/auth/guards/permission-auth.guard";
import { reactionsEntities, type ReactionsEntities } from "../libs";
import { ReactionsApiService } from "../services/reactions.api.service";
import {
	reactionsStoreDto,
	type ReactionsStoreDto,
} from "../dtos/reactions.store.dto";
import {
	reactionsUpdateDto,
	type ReactionsUpdateDto,
} from "../dtos/reactions.update.dto";
import type { Empresas } from "@/empresas/entities/empresas.entity";
import type { RequestVigilio } from "~/config/types";
import type { Users } from "@/users/entities/users.entity";

@Injectable()
@Controller("/reactions")
export class ReactionsApiController {
	constructor(private readonly ReactionsApiService: ReactionsApiService) {}

	@Pipe(
		objectAsync({
			reactionsable_type: string([
				custom(
					(val) => reactionsEntities.includes(val as ReactionsEntities),
					"entidad no válida",
				),
			]),
			reactionsable_id: string(),
		}),
	)
	@Get("/:reactionsable_type/:reactionsable_id")
	async index(
		@Params("reactionsable_type") reactionsable_type: ReactionsEntities,
		@Params("reactionsable_id") reactionsable_id: string,
		@Req("empresa") empresa: Empresas,
	) {
		const result = await this.ReactionsApiService.index(
			empresa,
			reactionsable_type,
			reactionsable_id,
		);
		return result;
	}

	@Pipe(
		objectAsync({
			reactionsable_type: string([
				custom(
					(val) => reactionsEntities.includes(val as ReactionsEntities),
					"entidad no válida",
				),
			]),
			reactionsable_id: string(),
			id: string(),
		}),
	)
	@Get("/:reactionsable_type/:reactionsable_id/:id")
	async show(
		@Params("reactionsable_type") reactionsable_type: string,
		@Params("reactionsable_id") reactionsable_id: string,
		@Params("id") id: string,
		@Req("empresa") empresa: Empresas,
	) {
		const result = await this.ReactionsApiService.show(
			empresa,
			reactionsable_type,
			reactionsable_id,
			id,
		);
		return result;
	}

	@Pipe(
		objectAsync({
			reactionsable_type: string([
				custom(
					(val) => reactionsEntities.includes(val as ReactionsEntities),
					"entidad no válida",
				),
			]),
			reactionsable_id: string(),
		}),
	)
	@PermissionAuth()
	@Validator(reactionsStoreDto)
	@Status(201)
	@Post("/:reactionsable_type/:reactionsable_id")
	async store(
		@Params("reactionsable_type") reactionsable_type: string,
		@Params("reactionsable_id") reactionsable_id: string,
		@Body() body: ReactionsStoreDto,
		@Req("user") user: Users,
		@Req("empresa") empresa: Empresas,
	) {
		const result = await this.ReactionsApiService.store(
			empresa,
			reactionsable_type,
			reactionsable_id,
			body,
			user.id,
		);
		return result;
	}

	@PermissionAuth()
	@Validator(reactionsUpdateDto)
	@Status(201)
	@Pipe(
		objectAsync({
			reactionsable_type: string([
				custom(
					(val) => reactionsEntities.includes(val as ReactionsEntities),
					"entidad no válida",
				),
			]),
			reactionsable_id: string(),
			id: string(),
		}),
	)
	@Put("/:reactionsable_type/:reactionsable_id/:id")
	async update(
		@Params("reactionsable_type") reactionsable_type: string,
		@Params("reactionsable_id") reactionsable_id: string,
		@Params("id") id: string,
		@Body() body: ReactionsUpdateDto,
		@Req() req: RequestVigilio,
	) {
		const result = await this.ReactionsApiService.update(
			req.empresa,
			reactionsable_type,
			reactionsable_id,
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
			reactionsable_type: string([
				custom(
					(val) => reactionsEntities.includes(val as ReactionsEntities),
					"entidad no válida",
				),
			]),
			reactionsable_id: string(),
			id: string(),
		}),
	)
	@Delete("/:reactionsable_type/:reactionsable_id/:id")
	async destroy(
		@Params("reactionsable_type") reactionsable_type: string,
		@Params("reactionsable_id") reactionsable_id: string,
		@Params("id") id: string,
		@Req() req: RequestVigilio,
	) {
		const result = await this.ReactionsApiService.destroy(
			req.empresa,
			reactionsable_type,
			reactionsable_id,
			id,
			req.user.id,
		);
		return result;
	}
}
