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
import {
	type ClientsStoreDto,
	clientsStoreDto,
} from "../dtos/clients.store.dto";
import { objectAsync, string } from "@vigilio/valibot";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";
import type { InformationEntity } from "@/information/entities/information.entity";
import { ClientsApiService } from "../services/clients.api.service";

@Injectable()
@Controller("/clients")
export class ClientsApiController {
	constructor(private readonly clientsApiService: ClientsApiService) {}

	@PermissionAdmin() // solo los admin pueden ver la lista de  usuarios
	@Get("/")
	async index(@Req("information") information: InformationEntity) {
		const result = await this.clientsApiService.index(information);
		return result;
	}

	@Pipe(
		objectAsync({
			slug: string(),
		}),
	)
	@Get("/:slug")
	async show(
		@Req("information") information: InformationEntity,
		@Params("slug") slug: string,
	) {
		const result = await this.clientsApiService.show(information, slug);
		return result;
	}

	@PermissionAdmin()
	@Validator(clientsStoreDto)
	@Status(201)
	@Post("/")
	async store(
		@Req("information") information: InformationEntity,
		@Body() body: ClientsStoreDto,
	) {
		const result = await this.clientsApiService.store(information, body);
		return result;
	}

	@PermissionAdmin()
	@Pipe(
		objectAsync({
			id: string(),
		}),
	)
	@Validator(clientsStoreDto)
	@Status(200)
	@Put("/:id")
	async update(
		@Req("information") information: InformationEntity,
		@Params("id") id: string,
		@Body() body: ClientsStoreDto,
	) {
		const result = await this.clientsApiService.update(information, id, body);
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
		const result = await this.clientsApiService.destroy(information, id);
		return result;
	}
}
