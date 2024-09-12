import {
	Body,
	Controller,
	Delete,
	Get,
	Params,
	Post,
	Put,
	Status,
	Injectable,
	Req,
} from "@vigilio/express-core";
import { Pipe, Validator } from "@vigilio/express-core/valibot";
import { objectAsync, string } from "valibot";
import { floorsStoreDto, type FloorsStoreDto } from "../dtos/floors.store.dto";
import {
	floorsUpdateDto,
	type FloorsUpdateDto,
} from "../dtos/floors.update.dto";
import { FloorsApiService } from "../services/floors.api.service";
import type { Empresas } from "@/empresas/entities/empresas.entity";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";

@Injectable()
@Controller("/floors")
export class FloorsApiController {
	constructor(private readonly floorsApiService: FloorsApiService) {}
	@PermissionAdmin()
	@Get("/")
	async index(@Req("empresa") empresa: Empresas) {
		const result = await this.floorsApiService.index(empresa);
		return result;
	}

	@PermissionAdmin()
	@Pipe(
		objectAsync({
			id: string(),
		}),
	)
	@Get("/:id")
	async show(@Params("id") id: string, @Req("empresa") empresa: Empresas) {
		const result = await this.floorsApiService.show(empresa, id);
		return result;
	}
	@PermissionAdmin()
	@Pipe(
		objectAsync({
			id: string(),
		}),
	)
	@Get("/:id/mesas")
	async mesas(@Params("id") slug: string, @Req("empresa") empresa: Empresas) {
		const result = await this.floorsApiService.mesas(empresa, slug);
		return result;
	}

	@PermissionAdmin()
	@Validator(floorsStoreDto)
	@Status(201)
	@Post("/")
	async store(@Body() body: FloorsStoreDto, @Req("empresa") empresa: Empresas) {
		const result = await this.floorsApiService.store(empresa, body);
		return result;
	}

	@PermissionAdmin()
	@Pipe(
		objectAsync({
			id: string(),
		}),
	)
	@Validator(floorsUpdateDto)
	@Status(201)
	@Put("/:id")
	async update(
		@Params("id") id: string,
		@Body() body: FloorsUpdateDto,
		@Req("empresa") empresa: Empresas,
	) {
		const result = await this.floorsApiService.update(empresa, id, body);
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
		const result = await this.floorsApiService.destroy(empresa, id);
		return result;
	}
}
