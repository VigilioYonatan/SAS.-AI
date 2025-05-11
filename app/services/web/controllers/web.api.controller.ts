import {
    Controller,
    Get,
    Injectable,
    Req,
    Params,
} from "@vigilio/express-core";
import { Empresas } from "@/empresas/entities/empresas.entity";
import { webEnabledMiddleware } from "../middlewares/webEnabled.middleware";
import { WebApiService } from "../services/web.api.service";
import type { RequestVigilio } from "~/config/types";
import type { Users } from "@/users/entities/users.entity";
import { initialMiddleware } from "../middlewares/initial.middleware";

@Injectable()
@Controller("/web")
export class WebApiController {
    constructor(private readonly webApiService: WebApiService) {}

    @Get("/", [webEnabledMiddleware])
    async home(@Req() req: RequestVigilio) {
        const result = await this.webApiService.home(req.empresa, req.user);
        return result;
    }

    @Get("/shop/:category_slug", [webEnabledMiddleware])
    async categories(
        @Params("category_slug") category_slug: string,
        @Req("empresa") empresa: Empresas
    ) {
        const result = await this.webApiService.categories(
            category_slug,
            empresa
        );
        return result;
    }

    @Get("/marcas/:brand", [webEnabledMiddleware])
    async marcas(
        @Params("brand") brand: string,
        @Req("empresa") empresa: Empresas
    ) {
        const result = await this.webApiService.marcas(empresa, brand);
        return result;
    }
    @Get("/blog", [webEnabledMiddleware])
    async blogs(@Req("empresa") empresa: Empresas) {
        const result = await this.webApiService.blogs(empresa);
        return result;
    }
    @Get("/blog/:blog", [webEnabledMiddleware])
    async blog(
        @Params("blog") blog: string,
        @Req("empresa") empresa: Empresas
    ) {
        const result = await this.webApiService.blog(empresa, blog);
        return result;
    }

    @Get("/:slug", [initialMiddleware])
    async product(
        @Params("slug") slug: string,
        @Req() req: RequestVigilio,
        @Req("user") user: Users
    ) {
        const result = await this.webApiService.product(slug, req, user);
        return result;
    }
}
