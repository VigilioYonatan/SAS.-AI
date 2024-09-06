import { OptionsApiService } from "@/products/services/options/options.api.service";
import { Controller, Get, Injectable } from "@vigilio/express-core";

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
	async features() {
		const result = await this.optionsApiService.features();
		return result;
	}
}
