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
import type { Empresas } from "../entities/empresas.entity";
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
    async index(@Req("empresa") empresa: Empresas) {
        const result = await this.settingsApiService.index(empresa);
        return result;
    }

    @Validator(settingsUpdateDto)
    @PermissionAdmin()
    @Status(201)
    @Put("/")
    async update(
        @Body() body: SettingsUpdateDto,
        @Req("empresa") empresa: Empresas
    ) {
        const result = await this.settingsApiService.update(empresa, body);
        return result;
    }
}
