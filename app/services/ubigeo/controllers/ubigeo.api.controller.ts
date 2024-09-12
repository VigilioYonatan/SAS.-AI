import { Body, Injectable, Params, Put, Req } from "@vigilio/express-core";
import { Controller, Get } from "@vigilio/express-core";
import { UbigeoApiService } from "../services/ubigeo.api.service";
import { objectAsync, string } from "@vigilio/valibot";
import { Pipe, Validator } from "@vigilio/express-core/valibot";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";
import type { Empresas } from "@/empresas/entities/empresas.entity";
import {
	regionsUpdateDto,
	type RegionsUpdateDto,
} from "../dtos/regions.update.dto";

@Injectable()
@Controller("/ubigeo")
export class UbigeoApiController {
	constructor(private readonly ubigeoApiService: UbigeoApiService) {}

	@Get("/regions")
	async regions(@Req("empresa") empresa: Empresas) {
		const result = await this.ubigeoApiService.regions(empresa);
		return result;
	}

	@Pipe(objectAsync({ id: string() }))
	@Get("/regions/:id")
	async regionsShow(
		@Params("id") id: string,
		@Req("empresa") empresa: Empresas,
	) {
		const result = await this.ubigeoApiService.regionsShow(empresa, id);
		return result;
	}

	@PermissionAdmin()
	@Validator(regionsUpdateDto)
	@Pipe(objectAsync({ id: string() }))
	@Put("/regions/:id")
	async regionsUpdate(
		@Req("empresa") empresa: Empresas,
		@Body() body: RegionsUpdateDto,
		@Params("id") id: string,
	) {
		const result = await this.ubigeoApiService.regionsUpdate(empresa, id, body);
		return result;
	}

	@Get("/cities")
	async cities(@Req("empresa") empresa: Empresas) {
		const result = await this.ubigeoApiService.cities(empresa);
		return result;
	}
}
