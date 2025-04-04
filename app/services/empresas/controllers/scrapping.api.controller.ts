import {
    Body,
    Controller,
    Get,
    Status,
    Injectable,
    Put,
    Req,
    Post,
} from "@vigilio/express-core";
import { Validator } from "@vigilio/express-core/valibot";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";
import type { Empresas } from "../entities/empresas.entity";
import { ScrappingApiService } from "../services/scrapping.api.service";
import {
    scrappingUpdateDto,
    type ScrappingUpdateDto,
} from "../dtos/scrapping.update.dto";
import { ScrappingSchema, scrappingSchema } from "../schemas/scrapping.schema";
import { pickAsync } from "@vigilio/valibot";

@Injectable()
@Controller("/empresas/scrapping")
export class ScrappingApiController {
    constructor(private readonly scrappingApiService: ScrappingApiService) {}

    @PermissionAdmin()
    @Get("/")
    async index(@Req("empresa") empresa: Empresas) {
        const result = await this.scrappingApiService.index(empresa);
        return result;
    }

    @PermissionAdmin()
    @Validator(pickAsync(scrappingSchema, ["categories"]))
    @Post("/test-categories")
    async testCategories(@Body() body: Pick<ScrappingSchema, "categories">) {
        const result = await this.scrappingApiService.testCategories(body);
        return result;
    }

    @PermissionAdmin()
    @Validator(scrappingUpdateDto)
    @Status(201)
    @Put("/")
    async update(
        @Body() body: ScrappingUpdateDto,
        @Req("empresa") empresa: Empresas
    ) {
        const result = await this.scrappingApiService.update(empresa, body);
        return result;
    }
}
