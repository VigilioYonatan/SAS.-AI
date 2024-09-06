import { Injectable, Req } from "@vigilio/express-core";
import { DetailOrdersApiService } from "../services/detail_orders.api.service";
import { Controller, Delete, Get, Params, Status } from "@vigilio/express-core";
import { Pipe } from "@vigilio/express-core/valibot";
import { objectAsync, string } from "@vigilio/valibot";
import type { InformationEntity } from "@/information/entities/information.entity";

@Injectable()
@Controller("/detail_orders")
export class DetailOrdersApiController {
	constructor(
		private readonly detailOrdersApiService: DetailOrdersApiService,
	) {}

	@Get("/")
	async index(@Req("information") information: InformationEntity) {
		const result = await this.detailOrdersApiService.index(information);
		return result;
	}

	@Pipe(
		objectAsync({
			id: string(),
		}),
	)
	@Get("/:id")
	async show(
		@Req("information") information: InformationEntity,
		@Params("id") slug: string,
	) {
		const result = await this.detailOrdersApiService.show(information, slug);
		return result;
	}

	@Pipe(
		objectAsync({
			id: string(),
		}),
	)
	@Status(201)
	@Delete("/:id")
	async destroy(
		@Req("information") information: InformationEntity,
		@Params("id") id: string,
	) {
		const result = await this.detailOrdersApiService.destroy(information, id);
		return result;
	}
}
