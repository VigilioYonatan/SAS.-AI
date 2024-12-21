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
import { NewApiService } from "../services/new.api.service";
import { newStoreDto, type NewStoreDto } from "../dtos/new.store.dto";
import { string } from "@vigilio/valibot";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";
import type { Empresas } from "../entities/empresas.entity";

@Injectable()
@Controller("/new")
export class NewApiController {
    constructor(private readonly newApiService: NewApiService) {}

    @PermissionAdmin()
    @Get("/")
    async index(@Req("empresa") empresa: Empresas) {
        const result = await this.newApiService.index(empresa);
        return result;
    }

    @PermissionAdmin()
    @Get("/:id")
    @Pipe(
        objectAsync({
            id: string(),
        })
    )
    async show(@Params("id") id: number, @Req("empresa") empresa: Empresas) {
        const result = await this.newApiService.show(empresa, id);
        return result;
    }

    @Validator(newStoreDto)
    @Status(201)
    @Post("/")
    async store(@Body() body: NewStoreDto, @Req("empresa") empresa: Empresas) {
        const result = await this.newApiService.store(empresa, body);
        return result;
    }

    @Validator(newStoreDto)
    @Pipe(
        objectAsync({
            id: string(),
        })
    )
    @PermissionAdmin()
    @Status(201)
    @Put("/:id")
    async update(
        @Body() body: NewStoreDto,
        @Req("empresa") empresa: Empresas,
        @Params("id") id: number
    ) {
        const result = await this.newApiService.update(empresa, id, body);
        return result;
    }

    @PermissionAdmin()
    @Pipe(
        objectAsync({
            id: string(),
        })
    )
    @Delete("/:id")
    async destroy(@Params("id") id: number, @Req("empresa") empresa: Empresas) {
        const result = await this.newApiService.destroy(empresa, id);
        return result;
    }
}
