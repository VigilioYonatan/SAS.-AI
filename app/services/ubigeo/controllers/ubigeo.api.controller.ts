import { Body, Injectable, Params, Put } from "@vigilio/express-core";
import { Controller, Get } from "@vigilio/express-core";
import { UbigeoApiService } from "../services/ubigeo.api.service";
import type { DepartmentsUpdateDto } from "../dtos/departments.update.dto";
import { objectAsync, string } from "@vigilio/valibot";
import { Pipe } from "@vigilio/express-core/valibot";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";

@Injectable()
@Controller("/ubigeo")
export class UbigeoApiController {
    constructor(private readonly ubigeoApiService: UbigeoApiService) {}

    @Get("/regions")
    async regions() {
        const result = await this.ubigeoApiService.regions();
        return result;
    }

    @Pipe(objectAsync({ id: string() }))
    @Get("/regions/:id")
    async regionsShow(@Params("id") id: string) {
        const result = await this.ubigeoApiService.regionsShow(id);
        return result;
    }

    @PermissionAdmin()
    @Pipe(objectAsync({ id: string() }))
    @Put("/regions/:id")
    async regionsUpdate(
        @Body() body: DepartmentsUpdateDto,
        @Params("id") id: string
    ) {
        const result = await this.ubigeoApiService.regionsUpdate(id, body);
        return result;
    }

    @Get("/cities")
    async cities() {
        const result = await this.ubigeoApiService.cities();
        return result;
    }
}
