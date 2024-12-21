import { EmailsApiService } from "../services/emails.api.service";
import { Pipe, Validator } from "@vigilio/express-core/valibot";
import { emailsStoreDto, type EmailsStoreDto } from "../dtos/emails.store.dto";
import { objectAsync, string } from "@vigilio/valibot";
import {
	emailsSendAllDto,
	type EmailsSendAllDto,
} from "../dtos/emails.send-all.dto";
import {
	Injectable,
	Body,
	Controller,
	Get,
	Params,
	Post,
	Req,
} from "@vigilio/express-core";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";
import type { Empresas } from "@/empresas/entities/empresas.entity";

@Injectable()
@Controller("/emails")
export class EmailsApiController {
	constructor(private readonly emailsApiService: EmailsApiService) {}

	@Validator(emailsStoreDto)
	@Post("/")
	async store(
		@Body() body: EmailsStoreDto,
		@Req("empresa") empresa: Empresas,
	) {
		const result = await this.emailsApiService.store(empresa, body);
		return result;
	}
	@PermissionAdmin()
	@Validator(emailsSendAllDto)
	@Post("/send-all")
	async sendAllUsers(
		@Body() body: EmailsSendAllDto,
		@Req("empresa") empresa: Empresas,
	) {
		const result = await this.emailsApiService.sendAllUsers(empresa, body);
		return result;
	}

	@PermissionAdmin()
	@Get("/accounts")
	async accounts() {
		const result = await this.emailsApiService.accounts();
		return result;
	}

	@PermissionAdmin()
	@Pipe(objectAsync({ account_id: string() }))
	@Get("/account/:account_id")
	async account(@Params("account_id") account_id: string) {
		const result = await this.emailsApiService.account(account_id);
		return result;
	}
	@PermissionAdmin()
	@Pipe(objectAsync({ id: string() }))
	@Get("/:id")
	async show(@Params("id") id: string) {
		const result = await this.emailsApiService.show(id);
		return result;
	}
}
