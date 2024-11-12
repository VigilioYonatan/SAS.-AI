import {
    Body,
    Controller,
    Delete,
    Get,
    Params,
    Post,
    Injectable,
    Put,
    Status,
    Req,
    Query,
} from "@vigilio/express-core";
import { Pipe, Validator } from "@vigilio/express-core/valibot";
import { objectAsync, omitAsync, string } from "@vigilio/valibot";
import type { Empresas } from "@/empresas/entities/empresas.entity";
import { CitasApiService } from "../services/citas.api.service";
import { citasUpdateDto, type CitasUpdateDto } from "../dtos/citas.update.dto";
import { citasStoreDto, type CitasStoreDto } from "../dtos/citas.store.dto";
import {
    citasSettingSchema,
    type CitasSettingSchema,
} from "../schemas/citas_settings.schema";
import { PermissionAdminWorker } from "@/auth/guards/permission-adminworker.guard";

@Injectable()
@Controller("/citas")
export class CitasApiController {
    constructor(private readonly citasApiService: CitasApiService) {}

    @PermissionAdminWorker()
    @Get("/")
    async index(@Req("empresa") empresa: Empresas) {
        const result = await this.citasApiService.index(empresa);
        return result;
    }

    @PermissionAdminWorker()
    @Get("/day")
    async day(@Req("empresa") empresa: Empresas, @Query("time") time: string) {
        const result = await this.citasApiService.day(empresa, time);
        return result;
    }
    @Pipe(
        objectAsync({
            slug: string(),
        })
    )
    @Get("/:slug")
    async show(
        @Req("empresa") empresa: Empresas,
        @Params("slug") slug: string
    ) {
        const result = await this.citasApiService.show(empresa, slug);
        return result;
    }
    @PermissionAdminWorker()
    @Get("/:year/:month")
    async month(
        @Req("empresa") empresa: Empresas,
        @Params("year") year: string,
        @Params("month") month: string
    ) {
        const result = await this.citasApiService.month(empresa, year, month);
        return result;
    }
    @PermissionAdminWorker()
    @Validator(citasStoreDto)
    @Status(201)
    @Post("/")
    async store(
        @Req("empresa") empresa: Empresas,
        @Body() body: CitasStoreDto
    ) {
        const result = await this.citasApiService.store(empresa, body);
        return result;
    }

    @PermissionAdminWorker()
    @Status(201)
    @Validator(omitAsync(citasSettingSchema, ["id", "empresa_id"]))
    @Put("/setting")
    async settingUpdate(
        @Req("empresa") empresa: Empresas,
        @Body() body: Omit<CitasSettingSchema, "id" | "empresa_id">
    ) {
        const result = await this.citasApiService.settingUpdate(empresa, body);
        return result;
    }
    @PermissionAdminWorker()
    @Pipe(
        objectAsync({
            id: string(),
        })
    )
    @Validator(citasUpdateDto)
    @Status(200)
    @Put("/:id")
    async update(
        @Req("empresa") empresa: Empresas,
        @Params("id") id: string,
        @Body() body: CitasUpdateDto
    ) {
        const result = await this.citasApiService.update(empresa, id, body);
        return result;
    }
    @PermissionAdminWorker()
    @Pipe(
        objectAsync({
            id: string(),
        })
    )
    @Status(201)
    @Delete("/:id")
    async destroy(@Req("empresa") empresa: Empresas, @Params("id") id: string) {
        const result = await this.citasApiService.destroy(empresa, id);
        return result;
    }
}
