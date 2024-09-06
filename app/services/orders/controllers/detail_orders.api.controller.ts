import { Injectable, Req } from "@vigilio/express-core";
import { DetailOrdersApiService } from "../services/detail_orders.api.service";
import { Controller, Delete, Get, Params, Status } from "@vigilio/express-core";
import { Pipe } from "@vigilio/express-core/valibot";
import { objectAsync, string } from "@vigilio/valibot";
import type { Empresas } from "@/empresas/entities/empresas.entity";

@Injectable()
@Controller("/detail_orders")
export class DetailOrdersApiController {
    constructor(
        private readonly detailOrdersApiService: DetailOrdersApiService
    ) {}

    @Get("/")
    async index(@Req("empresa") empresa: Empresas) {
        const result = await this.detailOrdersApiService.index(empresa);
        return result;
    }

    @Pipe(
        objectAsync({
            id: string(),
        })
    )
    @Get("/:id")
    async show(@Req("empresa") empresa: Empresas, @Params("id") slug: string) {
        const result = await this.detailOrdersApiService.show(empresa, slug);
        return result;
    }

    @Pipe(
        objectAsync({
            id: string(),
        })
    )
    @Status(201)
    @Delete("/:id")
    async destroy(@Req("empresa") empresa: Empresas, @Params("id") id: string) {
        const result = await this.detailOrdersApiService.destroy(empresa, id);
        return result;
    }
}
