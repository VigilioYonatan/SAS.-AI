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
import { objectAsync, string } from "@vigilio/valibot";
import { MesasApiService } from "../services/mesas.api.service";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";
import { mesasStoreDto, type MesasStoreDto } from "../dtos/mesas.store.dto";
import type { Empresas } from "@/empresas/entities/empresas.entity";
@Injectable()
@Controller("/mesas")
export class MesasApiController {
    constructor(private readonly mesasApiService: MesasApiService) {}

    @PermissionAdmin()
    @Get("/")
    async index(@Req("empresa") empresa: Empresas) {
        const result = await this.mesasApiService.index(empresa);
        return result;
    }

    // show mesas and orders
    @PermissionAdmin()
    @Pipe(
        objectAsync({
            floor_id: string(),
        })
    )
    @Get("/:floor_id/orders")
    async orders(
        @Req("empresa") empresa: Empresas,
        @Params("floor_id") floor_id: string
    ) {
        const result = await this.mesasApiService.orders(empresa, floor_id);
        return result;
    }

    @PermissionAdmin()
    @Pipe(
        objectAsync({
            id: string(),
        })
    )
    @Get("/:id")
    async show(@Req("empresa") empresa: Empresas, @Params("id") id: string) {
        const result = await this.mesasApiService.show(empresa, id);
        return result;
    }

    @PermissionAdmin()
    @Validator(mesasStoreDto)
    @Status(201)
    @Post("/")
    async store(
        @Req("empresa") empresa: Empresas,
        @Body() body: MesasStoreDto
    ) {
        const result = await this.mesasApiService.store(empresa, body);
        return result;
    }

    @PermissionAdmin()
    @Pipe(
        objectAsync({
            id: string(),
        })
    )
    @Status(201)
    @Delete("/:id")
    async destroy(@Req("empresa") empresa: Empresas, @Params("id") id: string) {
        const result = await this.mesasApiService.destroy(empresa, id);
        return result;
    }
}
