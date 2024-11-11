import {
	Controller,
	Delete,
	Get,
	Params,
	Post,
	Injectable,
	Req,
	Query,
} from "@vigilio/express-core";
import { Pipe } from "@vigilio/express-core/valibot";
import { objectAsync, string } from "@vigilio/valibot";
import { FavoritesApiService } from "../services/favorites.api.service";
import { PermissionAuth } from "@/auth/guards/permission-auth.guard";
import type { Users } from "@/users/entities/users.entity";
import type { Empresas } from "@/empresas/entities/empresas.entity";

@Injectable()
@Controller("/favorites")
export class FavoritesApiController {
	constructor(private readonly favoritesApiService: FavoritesApiService) {}

	@PermissionAuth()
	@Get("/")
	async index(@Req("empresa") empresa: Empresas, @Req("user") user: Users) {
		const result = await this.favoritesApiService.index(empresa, user);
		return result;
	}

	@PermissionAuth()
	@Pipe(
		objectAsync({
			product_id: string(),
		}),
	)
	@Get("/:product_id")
	async show(
		@Req("empresa") empresa: Empresas,
		@Params("product_id") product_id: string,
		@Req("user") user: Users,
		@Query("type") type: string,
	) {
		const result = await this.favoritesApiService.show(
			empresa,
			user,
			product_id,
			type === "service",
		);
		return result;
	}

	@PermissionAuth()
	@Pipe(
		objectAsync({
			product_id: string(),
		}),
	)
	@Post("/:product_id")
	async store(
		@Params("product_id") product_id: string,
		@Req("empresa") empresa: Empresas,
		@Req("user") user: Users,
		@Query("type") type: string,
	) {
		const result = await this.favoritesApiService.store(
			empresa,
			user,
			product_id,
			type === "service",
		);
		return result;
	}

	@PermissionAuth()
	@Pipe(
		objectAsync({
			product_id: string(),
		}),
	)
	@Delete("/:product_id")
	async destroy(
		@Req("empresa") empresa: Empresas,
		@Params("product_id") product_id: string,
		@Req("user") user: Users,
		@Query("type") type: string,
	) {
		const result = await this.favoritesApiService.destroy(
			empresa,
			user,
			product_id,
			type === "service",
		);
		return result;
	}
}
