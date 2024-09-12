import {
	Body,
	Controller,
	Delete,
	Get,
	Params,
	Post,
	Put,
	Injectable,
	Status,
	Req,
} from "@vigilio/express-core";
import { Pipe, Validator } from "@vigilio/express-core/valibot";
import { objectAsync, string } from "@vigilio/valibot";
import { CouponsApiService } from "../services/coupons.api.service";
import {
	couponsUpdateDto,
	type CouponsUpdateDto,
} from "../dtos/coupons.update.dto";
import {
	couponsStoreDto,
	type CouponsStoreDto,
} from "../dtos/coupons.store.dto";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";
import type { Empresas } from "@/empresas/entities/empresas.entity";

@Injectable()
@Controller("/coupons")
export class CouponsApiController {
	constructor(private readonly couponsApiService: CouponsApiService) {}

	@Get("/")
	async index(@Req("empresa") empresa: Empresas) {
		const result = await this.couponsApiService.index(empresa);
		return result;
	}

	@Pipe(
		objectAsync({
			coupon: string(),
		}),
	)
	@Get("/:coupon")
	async show(
		@Req("empresa") empresa: Empresas,
		@Params("coupon") coupon: string,
	) {
		const result = await this.couponsApiService.show(empresa, coupon);
		return result;
	}

	@PermissionAdmin()
	@Validator(couponsStoreDto)
	@Status(201)
	@Post("/")
	async store(
		@Req("empresa") empresa: Empresas,
		@Body() body: CouponsStoreDto,
	) {
		const result = await this.couponsApiService.store(empresa, body);
		return result;
	}

	@PermissionAdmin()
	@Pipe(
		objectAsync({
			id: string(),
		}),
	)
	@Validator(couponsUpdateDto)
	@Status(201)
	@Put("/:id")
	async update(
		@Req("empresa") empresa: Empresas,
		@Params("id") id: string,
		@Body() body: CouponsUpdateDto,
	) {
		const result = await this.couponsApiService.update(empresa, id, body);
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
	async destroy(@Req("empresa") empresa: Empresas, @Params("id") id: string) {
		const result = await this.couponsApiService.destroy(empresa, id);
		return result;
	}
}
