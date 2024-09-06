import { Controller, Get, Injectable, Params } from "@vigilio/express-core";
import { ServicioApiService } from "../services/servicio.api.service";
import { Pipe } from "@vigilio/express-core/valibot";
import { objectAsync, string } from "@vigilio/valibot";

@Injectable()
@Controller("/servicio")
export class ServicioApiController {
	constructor(private readonly servicioApiService: ServicioApiService) {}
	@Get("/")
	async index() {
		const result = await this.servicioApiService.index();
		return result;
	}

	@Pipe(objectAsync({ id: string() }))
	@Get("/empresas")
	async empresas(@Params("id") id: string) {
		const result = await this.servicioApiService.empresas(id);
		return result;
	}
}
