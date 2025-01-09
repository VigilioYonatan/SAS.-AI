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
import { CrudApiService } from "../services/crud.api.service";
import { crudStoreDto, type CrudStoreDto } from "../dtos/crud.store.dto";
import { string } from "@vigilio/valibot";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";
import type { Empresas } from "../entities/empresas.entity";
import { crudUpdateDto, type CrudUpdateDto } from "../dtos/crud.update.dto";

@Injectable()
@Controller("/crud")
export class CrudApiController {
    constructor(private readonly crudApiService: CrudApiService) {}

    @PermissionAdmin()
    @Get("/")
    async index(@Req("empresa") empresa: Empresas) {
        const result = await this.crudApiService.index(empresa);
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
        const result = await this.crudApiService.show(empresa, id);
        return result;
    }
    @PermissionAdmin()
    @Validator(crudStoreDto)
    @Status(201)
    @Post("/")
    async store(@Body() body: CrudStoreDto, @Req("empresa") empresa: Empresas) {
        const result = await this.crudApiService.store(empresa, body);
        return result;
    }

    @Validator(crudUpdateDto)
    @Pipe(
        objectAsync({
            id: string(),
        })
    )
    @PermissionAdmin()
    @Status(201)
    @Put("/:id")
    async update(
        @Body() body: CrudUpdateDto,
        @Req("empresa") empresa: Empresas,
        @Params("id") id: string
    ) {
        const result = await this.crudApiService.update(empresa, id, body);
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
        const result = await this.crudApiService.destroy(empresa, id);
        return result;
    }
}
