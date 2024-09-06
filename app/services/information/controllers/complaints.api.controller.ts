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

import { number, objectAsync } from "valibot";
import { ComplaintsApiService } from "../services/complaints.api.service";
import {
	complaintsStoreDto,
	type ComplaintsStoreDto,
} from "../dtos/complaints.store.dto";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";
import type { InformationEntity } from "../entities/information.entity";

@Injectable()
@Controller("/complaints")
export class ComplaintApiController {
	constructor(private readonly complaintsApiService: ComplaintsApiService) {}

	@PermissionAdmin()
	@Get("/")
	async index(@Req("information") information: InformationEntity) {
		const result = await this.complaintsApiService.index(information);
		return result;
	}

	@PermissionAdmin()
	@Get("/:id")
	@Pipe(
		objectAsync({
			id: number(),
		}),
	)
	async show(
		@Req("information") information: InformationEntity,
		@Params("id") id: number,
	) {
		const result = await this.complaintsApiService.show(information, id);
		return result;
	}

	@Validator(complaintsStoreDto)
	@Status(201)
	@Post("/")
	async store(
		@Req("information") information: InformationEntity,
		@Body() body: ComplaintsStoreDto,
	) {
		const result = await this.complaintsApiService.store(information, body);
		return result;
	}

	@PermissionAdmin()
	@Pipe(
		objectAsync({
			id: number(),
		}),
	)
	@Delete("/:id")
	async destroy(
		@Req("information") information: InformationEntity,
		@Params("id") id: number,
	) {
		const result = await this.complaintsApiService.destroy(information, id);
		return result;
	}
}
