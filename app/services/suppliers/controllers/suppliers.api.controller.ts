import { Injectable, Put, Req } from "@vigilio/express-core";
import {
    Body,
    Controller,
    Delete,
    Get,
    Params,
    Post,
} from "@vigilio/express-core";
import { Pipe, Validator } from "@vigilio/express-core/valibot";
import { objectAsync, string } from "@vigilio/valibot";
import { SuppliersApiService } from "../services/suppliers.api.service";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";
import {
    suppliersStoreDto,
    type SuppliersStoreDto,
} from "../dtos/suppliers.store.dto";
import {
    suppliersUpdateDto,
    type SuppliersUpdateDto,
} from "../dtos/suppliers.update.dto";
import type { Empresas } from "@/empresas/entities/empresas.entity";

@Injectable()
@Controller("/suppliers")
export class SuppliersApiController {
    constructor(private readonly suppliersApiService: SuppliersApiService) {}

    @PermissionAdmin()
    @Get("/")
    async index(@Req("empresa") empresa: Empresas) {
        const result = await this.suppliersApiService.index(empresa);
        return result;
    }

    @PermissionAdmin()
    @Pipe(
        objectAsync({
            code: string(),
        })
    )
    @Get("/:code")
    async show(
        @Req("empresa") empresa: Empresas,
        @Params("code") code: string
    ) {
        const result = await this.suppliersApiService.show(empresa, code);
        return result;
    }

    @PermissionAdmin()
    @Validator(suppliersStoreDto)
    @Post("/")
    async store(
        @Req("empresa") empresa: Empresas,
        @Body() body: SuppliersStoreDto
    ) {
        const result = await this.suppliersApiService.store(empresa, body);
        return result;
    }
    @PermissionAdmin()
    @Validator(suppliersUpdateDto)
    @Pipe(
        objectAsync({
            id: string(),
        })
    )
    @Put("/:id")
    async update(
        @Req("empresa") empresa: Empresas,
        @Params("id") id: string,
        @Body() body: SuppliersUpdateDto
    ) {
        const result = await this.suppliersApiService.update(empresa, id, body);
        return result;
    }

    @PermissionAdmin()
    @Pipe(
        objectAsync({
            id: string(),
        })
    )
    @Delete("/:id")
    async destroy(@Req("empresa") empresa: Empresas, @Params("id") id: string) {
        const result = await this.suppliersApiService.destroy(empresa, id);
        return result;
    }
}
