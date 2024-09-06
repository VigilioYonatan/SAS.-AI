import {
	Body,
	Controller,
	Get,
	Status,
	Injectable,
	Put,
	Req,
} from "@vigilio/express-core";
import { Validator } from "@vigilio/express-core/valibot";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";
import type { InformationEntity } from "../entities/information.entity";
import { SettingsApiService } from "../services/settings.api.service";
import {
	settingsUpdateDto,
	type SettingsUpdateDto,
} from "../dtos/settings.update.dto";

@Injectable()
@Controller("/settings")
export class SettingsApiController {
	constructor(private readonly settingsApiService: SettingsApiService) {}

	@PermissionAdmin()
	@Get("/")
	async index(@Req("information") information: InformationEntity) {
		const result = await this.settingsApiService.index(information);
		return result;
	}

	@Validator(settingsUpdateDto)
	@PermissionAdmin()
	@Status(201)
	@Put("/")
	async update(
		@Body() body: SettingsUpdateDto,
		@Req("information") information: InformationEntity,
	) {
		const result = await this.settingsApiService.update(information, body);
		return result;
	}
}
