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
} from "@vigilio/express-core";
import { Pipe, Validator } from "@vigilio/express-core/valibot";
import { objectAsync, string } from "@vigilio/valibot";
import { urlsStoreDto, type UrlsStoreDto } from "../dtos/urls.store.dto";
import { UrlsService } from "../services/urls.service";
import { urlsUpdateDto, type UrlsUpdateDto } from "../dtos/urls.update.dto";
import { PermissionAuth } from "@/auth/guards/permission-auth.guard";

@Injectable()
@Controller("/urls")
export class UrlsController {
	constructor(private readonly urlsService: UrlsService) {}

	@Get("/")
	async index() {
		const result = await this.urlsService.index();
		return result;
	}

	@Pipe(
		objectAsync({
			id: string(),
		}),
	)
	@Get("/:id")
	async show(@Params("id") id: string) {
		const result = await this.urlsService.show(id);
		return result;
	}

	@PermissionAuth()
	@Validator(urlsStoreDto)
	@Status(201)
	@Post("/")
	async store(@Body() body: UrlsStoreDto) {
		const result = await this.urlsService.store(body);
		return result;
	}

	@PermissionAuth()
	@Pipe(
		objectAsync({
			id: string(),
		}),
	)
	@Validator(urlsUpdateDto)
	@Status(200)
	@Put("/:id")
	async update(@Params("id") id: string, @Body() body: UrlsUpdateDto) {
		const result = await this.urlsService.update(id, body);
		return result;
	}

	@PermissionAuth()
	@Pipe(
		objectAsync({
			id: string(),
		}),
	)
	@Status(201)
	@Delete("/:id")
	async destroy(@Params("id") id: string) {
		const result = await this.urlsService.destroy(id);
		return result;
	}
}
