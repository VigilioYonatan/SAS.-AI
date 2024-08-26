import { Injectable } from "@vigilio/express-core";
import { Controller, Get } from "@vigilio/express-core";
import { SeedersApiService } from "../services/seeders.api.service";

@Injectable()
@Controller("/seed")
export class SeederApiController {
	constructor(private readonly seedersApiService: SeedersApiService) {}

	@Get("/")
	async index() {
		const result = await this.seedersApiService.index();
		return result;
	}
}
