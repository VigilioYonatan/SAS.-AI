import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";
import type { Empresas } from "@/empresas/entities/empresas.entity";
import {
	Body,
	Controller,
	Delete,
	Get,
	Injectable,
	Params,
	Post,
	Put,
	Req,
} from "@vigilio/express-core";
import { Pipe, Validator } from "@vigilio/express-core/valibot";
import { CategoriesFinanzasApiService } from "../services/categories.api.service";
import { objectAsync, string } from "@vigilio/valibot";
import {
	categoriesFinanzasStoreDto,
	type CategoriesFinanzasStoreDto,
} from "../dtos/categories.store.dto";

@Injectable()
@Controller("/categories_finanzas")
export class CategoriesFinanzasApiController {
	constructor(
		private readonly categoriesFinanzasApiService: CategoriesFinanzasApiService,
	) {}

	@PermissionAdmin()
	@Get("/")
	async index(@Req("empresa") empresa: Empresas) {
		const result = await this.categoriesFinanzasApiService.index(empresa);
		return result;
	}
	@PermissionAdmin()
	@Pipe(
		objectAsync({
			id: string(),
		}),
	)
	@Get("/:id")
	async show(@Req("empresa") empresa: Empresas, @Params("id") id: string) {
		const result = await this.categoriesFinanzasApiService.show(empresa, id);
		return result;
	}

	@PermissionAdmin()
	@Validator(categoriesFinanzasStoreDto)
	@Post("/")
	async store(
		@Req("empresa") empresa: Empresas,
		@Body() body: CategoriesFinanzasStoreDto,
	) {
		const result = await this.categoriesFinanzasApiService.store(empresa, body);
		return result;
	}
	@PermissionAdmin()
	@Validator(categoriesFinanzasStoreDto)
	@Pipe(
		objectAsync({
			id: string(),
		}),
	)
	@Put("/:id")
	async update(
		@Req("empresa") empresa: Empresas,
		@Params("id") id: string,
		@Body() body: CategoriesFinanzasStoreDto,
	) {
		const result = await this.categoriesFinanzasApiService.update(
			empresa,
			id,
			body,
		);
		return result;
	}

	@PermissionAdmin()
	@Pipe(
		objectAsync({
			id: string(),
		}),
	)
	@Delete("/:id")
	async destroy(@Req("empresa") empresa: Empresas, @Params("id") id: string) {
		const result = await this.categoriesFinanzasApiService.destroy(empresa, id);
		return result;
	}
}
