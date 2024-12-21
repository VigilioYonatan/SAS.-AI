import {
    Body,
    Controller,
    Delete,
    Get,
    Params,
    Post,
    Status,
    Injectable,
    Put,
    Req,
} from "@vigilio/express-core";
import { Pipe, Validator } from "@vigilio/express-core/valibot";
import { objectAsync } from "valibot";
import { PagesApiService } from "../services/pages.api.service";
import { pagesStoreDto, type PagesStoreDto } from "../dtos/pages.store.dto";
import { string } from "@vigilio/valibot";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";
import type { Empresas } from "../entities/empresas.entity";
import { pagesUpdateDto, type PagesUpdateDto } from "../dtos/pages.update.dto";

@Injectable()
@Controller("/pages")
export class PagesApiController {
    constructor(private readonly pagesApiService: PagesApiService) {}

    @PermissionAdmin()
    @Get("/")
    async index(@Req("empresa") empresa: Empresas) {
        const result = await this.pagesApiService.index(empresa);
        return result;
    }

    @PermissionAdmin()
    @Get("/:id")
    @Pipe(
        objectAsync({
            id: string(),
        })
    )
    async show(@Params("id") id: string, @Req("empresa") empresa: Empresas) {
        const result = await this.pagesApiService.show(empresa, id);
        return result;
    }

    @Validator(pagesStoreDto)
    @Status(201)
    @Post("/")
    async store(
        @Body() body: PagesStoreDto,
        @Req("empresa") empresa: Empresas
    ) {
        const result = await this.pagesApiService.store(empresa, body);
        return result;
    }

    @Validator(pagesUpdateDto)
    @Pipe(
        objectAsync({
            id: string(),
        })
    )
    @PermissionAdmin()
    @Status(201)
    @Put("/:id")
    async update(
        @Body() body: PagesUpdateDto,
        @Req("empresa") empresa: Empresas,
        @Params("id") id: string
    ) {
        const result = await this.pagesApiService.update(empresa, id, body);
        return result;
    }

    @PermissionAdmin()
    @Pipe(
        objectAsync({
            id: string(),
        })
    )
    @Delete("/:id")
    async destroy(@Params("id") id: string, @Req("empresa") empresa: Empresas) {
        const result = await this.pagesApiService.destroy(empresa, id);
        return result;
    }
}
