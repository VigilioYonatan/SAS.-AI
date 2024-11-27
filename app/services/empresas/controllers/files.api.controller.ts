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
import { objectAsync } from "valibot";
import { pickAsync, string } from "@vigilio/valibot";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";
import type { Empresas } from "../entities/empresas.entity";
import { FilesApiService } from "../services/files.api.service";
import { fileSchema, type FileSchema } from "../schemas/file.schema";

@Injectable()
@Controller("/files")
export class FilesApiServiceApiController {
	constructor(private readonly filesApiService: FilesApiService) {}

	@Get("/")
	async index(@Req("empresa") empresa: Empresas) {
		const result = await this.filesApiService.index(empresa);
		return result;
	}
	@PermissionAdmin()
	@Pipe(objectAsync({ id: string() }))
	@Get("/:id")
	async show(@Req("empresa") empresa: Empresas, @Params("id") id: string) {
		const result = await this.filesApiService.show(empresa, id);
		return result;
	}

	@PermissionAdmin()
	@Validator(pickAsync(fileSchema, ["file"]))
	@Status(201)
	@Post("/")
	async store(
		@Body() body: Pick<FileSchema, "file">,
		@Req("empresa") empresa: Empresas,
	) {
		const result = await this.filesApiService.store(empresa, body);
		return result;
	}

	@PermissionAdmin()
	@Pipe(
		objectAsync({
			id: string(),
		}),
	)
	@Delete("/:id")
	async destroy(@Params("id") id: string, @Req("empresa") empresa: Empresas) {
		const result = await this.filesApiService.destroy(empresa, id);
		return result;
	}
}
