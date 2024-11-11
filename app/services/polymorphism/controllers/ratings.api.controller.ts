import { Injectable, Req } from "@vigilio/express-core";
import {
	Body,
	Controller,
	Delete,
	Get,
	Params,
	Post,
	Put,
	Status,
} from "@vigilio/express-core";
import { Pipe, Validator } from "@vigilio/express-core/valibot";
import { custom, objectAsync, string } from "@vigilio/valibot";
import { PermissionAuth } from "@/auth/guards/permission-auth.guard";
import type { Users } from "@/users/entities/users.entity";
import { RatingsApiService } from "../services/ratings.api.service";
import { ratingsEntities, type RatingsEntities } from "../libs";
import {
	ratingsStoreDto,
	type RatingsStoreDto,
} from "../dtos/ratings.store.dto";
import {
	ratingsUpdateDto,
	type RatingsUpdateDto,
} from "../dtos/ratings.update.dto";
import type { Empresas } from "@/empresas/entities/empresas.entity";

@Injectable()
@Controller("/ratings")
export class RatingApiController {
	constructor(private readonly ratingApiService: RatingsApiService) {}

	@Pipe(
		objectAsync({
			ratingsable_type: string([
				custom(
					(val) => ratingsEntities.includes(val as RatingsEntities),
					"entidad no válida",
				),
			]),
			ratingsable_id: string(),
		}),
	)
	@Get("/:ratingsable_type/:ratingsable_id")
	async index(
		@Params("ratingsable_type") ratingsable_type: RatingsEntities,
		@Params("ratingsable_id") ratingsable_id: string,
		@Req("empresa") empresa: Empresas,
	) {
		const result = await this.ratingApiService.index(
			empresa,
			ratingsable_type,
			ratingsable_id,
		);
		return result;
	}

	@Pipe(
		objectAsync({
			ratingsable_type: string([
				custom(
					(val) => ratingsEntities.includes(val as RatingsEntities),
					"entidad no válida",
				),
			]),
			ratingsable_id: string(),
		}),
	)
	@PermissionAuth()
	@Get("/:ratingsable_type/:ratingsable_id")
	async show(
		@Params("ratingsable_type") ratingsable_type: string,
		@Params("ratingsable_id") ratingsable_id: string,
		@Req("user") user: Users,
		@Req("empresa") empresa: Empresas,
	) {
		const result = await this.ratingApiService.show(
			empresa,
			ratingsable_type,
			ratingsable_id,
			user.id,
		);
		return result;
	}

	@Pipe(
		objectAsync({
			ratingsable_type: string([
				custom(
					(val) => ratingsEntities.includes(val as RatingsEntities),
					"entidad no válida",
				),
			]),
			ratingsable_id: string(),
		}),
	)
	@PermissionAuth()
	@Validator(ratingsStoreDto)
	@Status(201)
	@Post("/:ratingsable_type/:ratingsable_id")
	async store(
		@Params("ratingsable_type") ratingsable_type: string,
		@Params("ratingsable_id") ratingsable_id: string,
		@Body() body: RatingsStoreDto,
		@Req("user") user: Users,
		@Req("empresa") empresa: Empresas,
	) {
		const result = await this.ratingApiService.store(
			empresa,
			ratingsable_type,
			ratingsable_id,
			body,
			user.id,
		);
		return result;
	}

	@PermissionAuth()
	@Validator(ratingsUpdateDto)
	@Status(201)
	@Pipe(
		objectAsync({
			ratingsable_type: string([
				custom(
					(val) => ratingsEntities.includes(val as RatingsEntities),
					"entidad no válida",
				),
			]),
			ratingsable_id: string(),
		}),
	)
	@PermissionAuth()
	@Put("/:ratingsable_type/:ratingsable_id")
	async update(
		@Params("ratingsable_type") ratingsable_type: string,
		@Params("ratingsable_id") ratingsable_id: string,
		@Body() body: RatingsUpdateDto,
		@Req("user") user: Users,
		@Req("empresa") empresa: Empresas,
	) {
		const result = await this.ratingApiService.update(
			empresa,
			ratingsable_type,
			ratingsable_id,
			body,
			user.id,
		);
		return result;
	}

	@PermissionAuth()
	@Status(201)
	@Pipe(
		objectAsync({
			ratingsable_type: string([
				custom(
					(val) => ratingsEntities.includes(val as RatingsEntities),
					"entidad no válida",
				),
			]),
			ratingsable_id: string(),
		}),
	)
	@Delete("/:ratingsable_type/:ratingsable_id")
	async destroy(
		@Params("ratingsable_type") ratingsable_type: string,
		@Params("ratingsable_id") ratingsable_id: string,
		@Req("user") user: Users,
		@Req("empresa") empresa: Empresas,
	) {
		const result = await this.ratingApiService.destroy(
			empresa,
			ratingsable_type,
			ratingsable_id,
			user.id,
		);
		return result;
	}
}
