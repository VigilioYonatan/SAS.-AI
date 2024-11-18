import {
	Body,
	Controller,
	Get,
	Params,
	Status,
	Injectable,
	Put,
	Req,
} from "@vigilio/express-core";
import { Pipe, Validator } from "@vigilio/express-core/valibot";
import { objectAsync } from "valibot";
import { string } from "@vigilio/valibot";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";
import type { Empresas } from "../entities/empresas.entity";
import { GridBannerApiService } from "../services/grid_banner.api.service";
import {
	gridBannerUpdateDto,
	type GridBannerUpdateDto,
} from "../dtos/grid_banner.update.dto";

@Injectable()
@Controller("/grid_banner")
export class GridBannerApiController {
	constructor(private readonly gridBannerApiService: GridBannerApiService) {}

	@PermissionAdmin()
	@Get("/")
	async index(@Req("empresa") empresa: Empresas) {
		const result = await this.gridBannerApiService.index(empresa);
		return result;
	}

	@PermissionAdmin()
	@Get("/:id")
	@Pipe(
		objectAsync({
			id: string(),
		}),
	)
	async show(@Params("id") id: string, @Req("empresa") empresa: Empresas) {
		const result = await this.gridBannerApiService.show(empresa, id);
		return result;
	}

	@Validator(gridBannerUpdateDto)
	@Pipe(
		objectAsync({
			id: string(),
		}),
	)
	@PermissionAdmin()
	@Status(201)
	@Put("/:id")
	async update(
		@Body() body: GridBannerUpdateDto,
		@Req("empresa") empresa: Empresas,
		@Params("id") id: string,
	) {
		const result = await this.gridBannerApiService.update(empresa, id, body);
		return result;
	}
}
