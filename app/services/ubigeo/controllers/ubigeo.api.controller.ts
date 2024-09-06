import { Body, Injectable, Params, Put, Req } from "@vigilio/express-core";
import { Controller, Get } from "@vigilio/express-core";
import { UbigeoApiService } from "../services/ubigeo.api.service";
import { objectAsync, string } from "@vigilio/valibot";
import { Pipe, Validator } from "@vigilio/express-core/valibot";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";
import type { InformationEntity } from "@/information/entities/information.entity";
import {
	regionsUpdateDto,
	type RegionsUpdateDto,
} from "../dtos/regions.update.dto";

@Injectable()
@Controller("/ubigeo")
export class UbigeoApiController {
	constructor(private readonly ubigeoApiService: UbigeoApiService) {}

	@Get("/regions")
	async regions(@Req("information") information: InformationEntity) {
		const result = await this.ubigeoApiService.regions(information);
		return result;
	}

	@Pipe(objectAsync({ id: string() }))
	@Get("/regions/:id")
	async regionsShow(
		@Params("id") id: string,
		@Req("information") information: InformationEntity,
	) {
		const result = await this.ubigeoApiService.regionsShow(information, id);
		return result;
	}

	@PermissionAdmin()
	@Validator(regionsUpdateDto)
	@Pipe(objectAsync({ id: string() }))
	@Put("/regions/:id")
	async regionsUpdate(
		@Req("information") information: InformationEntity,
		@Body() body: RegionsUpdateDto,
		@Params("id") id: string,
	) {
		const result = await this.ubigeoApiService.regionsUpdate(
			information,
			id,
			body,
		);
		return result;
	}

	@Get("/cities")
	async cities(@Req("information") information: InformationEntity) {
		const result = await this.ubigeoApiService.cities(information);
		return result;
	}
}
