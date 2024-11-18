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
import { objectAsync, string } from "@vigilio/valibot";
import {
	subcategoriesStoreDto,
	type SubcategoriesStoreDto,
} from "../dtos/subcategories.store.dto";
import { SubCategoriesApiService } from "../services/subcategories.api.service";
import {
	subcategoriesUpdateDto,
	type SubcategoriesUpdateDto,
} from "../dtos/subcategories.update.dto";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";
import type { Empresas } from "@/empresas/entities/empresas.entity";

@Injectable()
@Controller("/subcategories")
export class SubcategoriesApiController {
	constructor(
		private readonly subcategoriesApiService: SubCategoriesApiService,
	) {}

	@Get("/")
	async index(@Req("empresa") empresa: Empresas) {
		const result = await this.subcategoriesApiService.index(empresa);
		return result;
	}

	@Pipe(
		objectAsync({
			slug: string(),
		}),
	)
	@Get("/:slug")
	async show(@Params("slug") slug: string, @Req("empresa") empresa: Empresas) {
		const result = await this.subcategoriesApiService.show(empresa, slug);
		return result;
	}

	@PermissionAdmin()
	@Validator(subcategoriesStoreDto)
	@Status(201)
	@Post("/")
	async store(
		@Body() body: SubcategoriesStoreDto,
		@Req("empresa") empresa: Empresas,
	) {
		const result = await this.subcategoriesApiService.store(empresa, body);
		return result;
	}

	@PermissionAdmin()
	@Pipe(
		objectAsync({
			id: string(),
		}),
	)
	@Validator(subcategoriesUpdateDto)
	@Status(200)
	@Put("/:id")
	async update(
		@Params("id") id: string,
		@Body() body: SubcategoriesUpdateDto,
		@Req("empresa") empresa: Empresas,
	) {
		const result = await this.subcategoriesApiService.update(empresa, id, body);
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
	async destroy(@Params("id") id: string, @Req("empresa") empresa: Empresas) {
		const result = await this.subcategoriesApiService.destroy(empresa, id);
		return result;
	}
}
