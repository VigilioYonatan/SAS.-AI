import {
	Body,
	Controller,
	Delete,
	Get,
	Params,
	Post,
	Injectable,
	Put,
	Status,
	Req,
} from "@vigilio/express-core";
import { Pipe, Validator } from "@vigilio/express-core/valibot";
import { objectAsync, string } from "@vigilio/valibot";
import { brandsStoreDto, type BrandsStoreDto } from "../dtos/brands.store.dto";
import {
	brandsUpdateDto,
	type BrandsUpdateDto,
} from "../dtos/brands.update.dto";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";
import type { Empresas } from "@/empresas/entities/empresas.entity";
import { BrandsApiService } from "../services/brands.api.service";

@Injectable()
@Controller("/brands")
export class BrandsApiController {
	constructor(private readonly brandsApiService: BrandsApiService) {}

	@Get("/")
	async index(@Req("empresa") empresa: Empresas) {
		const result = await this.brandsApiService.index(empresa);
		return result;
	}

	@Pipe(
		objectAsync({
			slug: string(),
		}),
	)
	@Get("/:slug")
	async show(@Req("empresa") empresa: Empresas, @Params("slug") slug: string) {
		const result = await this.brandsApiService.show(empresa, slug);
		return result;
	}

	@PermissionAdmin()
	@Validator(brandsStoreDto)
	@Status(201)
	@Post("/")
	async store(@Req("empresa") empresa: Empresas, @Body() body: BrandsStoreDto) {
		const result = await this.brandsApiService.store(empresa, body);
		return result;
	}

	@PermissionAdmin()
	@Pipe(
		objectAsync({
			id: string(),
		}),
	)
	@Validator(brandsUpdateDto)
	@Status(200)
	@Put("/:id")
	async update(
		@Req("empresa") empresa: Empresas,
		@Params("id") id: string,
		@Body() body: BrandsUpdateDto,
	) {
		const result = await this.brandsApiService.update(empresa, id, body);
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
		const result = await this.brandsApiService.destroy(empresa, id);
		return result;
	}
}
