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
import type { InformationEntity } from "@/information/entities/information.entity";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";

@Injectable()
@Controller("/floors")
export class FloorsApiController {
	constructor(private readonly floorsApiService: FloorsApiService) {}
	@PermissionAdmin()
	@Get("/")
	async index(@Req("information") information: InformationEntity) {
		const result = await this.floorsApiService.index(information);
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
		@Params("id") id: string,
		@Req("information") information: InformationEntity,
	) {
		const result = await this.floorsApiService.show(information, id);
		return result;
	}
	@PermissionAdmin()
	@Pipe(
		objectAsync({
			id: string(),
		}),
	)
	@Get("/:id/mesas")
	async mesas(
		@Params("id") slug: string,
		@Req("information") information: InformationEntity,
	) {
		const result = await this.floorsApiService.mesas(information, slug);
		return result;
	}

	@PermissionAdmin()
	@Validator(floorsStoreDto)
	@Status(201)
	@Post("/")
	async store(
		@Body() body: FloorsStoreDto,
		@Req("information") information: InformationEntity,
	) {
		const result = await this.floorsApiService.store(information, body);
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
		@Req("information") information: InformationEntity,
	) {
		const result = await this.floorsApiService.update(information, id, body);
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
		@Params("id") id: string,
		@Req("information") information: InformationEntity,
	) {
		const result = await this.floorsApiService.destroy(information, id);
		return result;
	}
}
