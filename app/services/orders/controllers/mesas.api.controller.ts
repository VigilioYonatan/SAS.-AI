import {
	Body,
	Controller,
	Delete,
	Get,
	Params,
	Post,
	Status,
	Injectable,
	Req,
} from "@vigilio/express-core";
import { Pipe, Validator } from "@vigilio/express-core/valibot";
import { objectAsync, string } from "@vigilio/valibot";
import { MesasApiService } from "../services/mesas.api.service";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";
import { mesasStoreDto, type MesasStoreDto } from "../dtos/mesas.store.dto";
import type { InformationEntity } from "@/information/entities/information.entity";
@Injectable()
@Controller("/mesas")
export class MesasApiController {
	constructor(private readonly mesasApiService: MesasApiService) {}

	@PermissionAdmin()
	@Get("/")
	async index(@Req("information") information: InformationEntity) {
		const result = await this.mesasApiService.index(information);
		return result;
	}

	// show mesas and orders
	@PermissionAdmin()
	@Pipe(
		objectAsync({
			floor_id: string(),
		}),
	)
	@Get("/:floor_id/orders")
	async orders(
		@Req("information") information: InformationEntity,
		@Params("floor_id") floor_id: string,
	) {
		const result = await this.mesasApiService.orders(information, floor_id);
		return result;
	}

	@PermissionAdmin()
	@Pipe(
		objectAsync({
			id: string(),
		}),
	)
	@Get("/:id")
	async show(
		@Req("information") information: InformationEntity,
		@Params("id") id: string,
	) {
		const result = await this.mesasApiService.show(information, id);
		return result;
	}

	@PermissionAdmin()
	@Validator(mesasStoreDto)
	@Status(201)
	@Post("/")
	async store(
		@Req("information") information: InformationEntity,
		@Body() body: MesasStoreDto,
	) {
		const result = await this.mesasApiService.store(information, body);
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
	async destroy(
		@Req("information") information: InformationEntity,
		@Params("id") id: string,
	) {
		const result = await this.mesasApiService.destroy(information, id);
		return result;
	}
}
