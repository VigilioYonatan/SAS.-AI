import { Validator } from "@vigilio/express-core/valibot";
import { Injectable, Body, Controller, Post } from "@vigilio/express-core";
import { EmailsPromocionesApiService } from "../services/emails_promociones.api.service";
import {
	emailsPromocionesStoreDto,
	type EmailsPromocionesStoreDto,
} from "../dtos/emails_promociones.store.dto";

@Injectable()
@Controller("/emails_promociones")
export class EmailsPromocionesApiController {
	constructor(
		private readonly emailsPromocionesApiService: EmailsPromocionesApiService,
	) {}

	@Validator(emailsPromocionesStoreDto)
	@Post("/")
	async store(@Body() body: EmailsPromocionesStoreDto) {
		const result = await this.emailsPromocionesApiService.store(body);
		return result;
	}
}
