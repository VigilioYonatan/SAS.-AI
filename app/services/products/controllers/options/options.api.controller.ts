import type { Empresas } from "@/empresas/entities/empresas.entity";
import { OptionsApiService } from "@/products/services/options/options.api.service";
import { Controller, Get, Injectable, Req } from "@vigilio/express-core";

@Injectable()
@Controller("/options")
export class OptionsApiController {
	constructor(private readonly optionsApiService: OptionsApiService) {}

	@Get("/")
	async index() {
		const result = await this.optionsApiService.index();
		return result;
	}

	@Get("/features")
	async features(@Req("empresa") empresa: Empresas) {
		const result = await this.optionsApiService.features(empresa);
		return result;
	}
}
