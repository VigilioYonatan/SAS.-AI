import { Injectable, Query, Req } from "@vigilio/express-core";
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
import { objectAsync, string } from "@vigilio/valibot";
import { CategoriesApiService } from "../services/categories.api.service";
import {
	categoriesStoreDto,
	type CategoriesStoreDto,
} from "../dtos/categories.store.dto";
import {
	categoriesUpdateDto,
	type CategoriesUpdateDto,
} from "../dtos/categories.update.dto";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";
import type { Empresas } from "@/empresas/entities/empresas.entity";

@Injectable()
@Controller("/categories")
export class CategoriesApiController {
	constructor(private readonly categoriesApiService: CategoriesApiService) {}

	@Get("/")
	async index(@Req("empresa") empresa: Empresas, @Query("type") type: string) {
		const result = await this.categoriesApiService.index(
			empresa,
			type === "service",
		);
		return result;
	}

	@Pipe(
		objectAsync({
			slug: string(),
		}),
	)
	@Get("/:slug")
	async show(@Req("empresa") empresa: Empresas, @Params("slug") slug: string) {
		const result = await this.categoriesApiService.show(empresa, slug);
		return result;
	}

	@PermissionAdmin()
	@Validator(categoriesStoreDto)
	@Status(201)
	@Post("/")
	async store(
		@Req("empresa") empresa: Empresas,
		@Body() body: CategoriesStoreDto,
	) {
		const result = await this.categoriesApiService.store(empresa, body);
		return result;
	}

	@PermissionAdmin()
	@Pipe(
		objectAsync({
			id: string(),
		}),
	)
	@Validator(categoriesUpdateDto)
	@Status(200)
	@Put("/:id")
	async update(
		@Req("empresa") empresa: Empresas,
		@Params("id") id: string,
		@Body() body: CategoriesUpdateDto,
	) {
		const result = await this.categoriesApiService.update(empresa, id, body);
		return result;
	}

	@PermissionAdmin()
	@Pipe(
		objectAsync({
			id: string(),
		}),
	)
	@Status(201)
	@Delete("/:id")
	async destroy(@Req("empresa") empresa: Empresas, @Params("id") id: string) {
		const result = await this.categoriesApiService.destroy(empresa, id);
		return result;
	}
}
