import {
    Body,
    Controller,
    Delete,
    Get,
    Params,
    Post,
    Status,
    Injectable,
    Req,
} from "@vigilio/express-core";
import { Pipe, Validator } from "@vigilio/express-core/valibot";

import { number, objectAsync } from "valibot";
import { ComplaintsApiService } from "../services/complaints.api.service";
import {
    complaintsStoreDto,
    type ComplaintsStoreDto,
} from "../dtos/complaints.store.dto";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";
import type { Empresas } from "../entities/empresas.entity";

@Injectable()
@Controller("/complaints")
export class ComplaintApiController {
    constructor(private readonly complaintsApiService: ComplaintsApiService) {}

    @PermissionAdmin()
    @Get("/")
    async index(@Req("empresa") empresa: Empresas) {
        const result = await this.complaintsApiService.index(empresa);
        return result;
    }

    @PermissionAdmin()
    @Get("/:id")
    @Pipe(
        objectAsync({
            id: number(),
        })
    )
    async show(@Req("empresa") empresa: Empresas, @Params("id") id: number) {
        const result = await this.complaintsApiService.show(empresa, id);
        return result;
    }

    @Validator(complaintsStoreDto)
    @Status(201)
    @Post("/")
    async store(
        @Req("empresa") empresa: Empresas,
        @Body() body: ComplaintsStoreDto
    ) {
        const result = await this.complaintsApiService.store(empresa, body);
        return result;
    }

    @PermissionAdmin()
    @Pipe(
        objectAsync({
            id: number(),
        })
    )
    @Delete("/:id")
    async destroy(@Req("empresa") empresa: Empresas, @Params("id") id: number) {
        const result = await this.complaintsApiService.destroy(empresa, id);
        return result;
    }
}
