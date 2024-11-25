import {
    Controller,
    Get,
    Query,
    Res,
    Injectable,
    Req,
    Params,
    BadRequestException,
} from "@vigilio/express-core";
import type { Response } from "express";
import { WebService } from "../services/web.service";
import { Empresas } from "@/empresas/entities/empresas.entity";
import { Pipe } from "@vigilio/express-core/valibot";
import { objectAsync, string } from "@vigilio/valibot";
import { UrlsService } from "@/urls/services/urls.service";
import type { RequestVigilio } from "~/config/types";
import { webEnabledMiddleware } from "../middlewares/webEnabled.middleware";
import type { Users } from "@/users/entities/users.entity";

@Injectable()
@Controller("/")
export class WebController {
    constructor(
        private readonly webService: WebService,
        private readonly urlsService: UrlsService
    ) {}

    @Get("/manifest.webmanifest.json")
    async manifest(@Req("empresa") empresa: Empresas) {
        const result = this.webService.manifest(empresa);
        return result;
    }
    @Get("/proxy")
    async proxy(@Req() req: RequestVigilio, @Res() res: Response) {
        const { url } = req.query as { url: string };
        if (!url) throw new BadRequestException("Url necesita");
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Error al obtener la URL remota");
            }

            // Configurar los headers para reenviar la imagen
            res.set(
                "Content-Type",
                response.headers.get("content-type") || "image/jpeg"
            );
            res.send(Buffer.from(await response.arrayBuffer()));
        } catch (error) {
            res.status(500).send("Error fetching the URL");
        }
    }
    @Get("/hello-world")
    async helloworld(@Res() res: Response) {
        return res.send("<h1>Hello World!!!</h1>"); // no borrar
    }

    @Get("/", [webEnabledMiddleware])
    async home(@Res() res: Response, @Req() req: RequestVigilio) {
        const result = await this.webService.home(req.empresa, req.user);
        return res.render("web/home", result);
    }

    @Get("/404")
    async page404(@Query("message") message: string, @Res() res: Response) {
        res.status(404);
        return res.render("web/404", {
            title: "404",
            message: message ?? "No se a encontrado esta página",
        });
    }
    @Get("/shop", [webEnabledMiddleware])
    async shop(
        @Res() res: Response,
        @Req("empresa") empresa: Empresas,
        @Req("user") user: Users
    ) {
        const result = await this.webService.shop(empresa, user);
        return res.render("web/shop", result);
    }

    @Get("/shop/:category_slug", [webEnabledMiddleware])
    async categories(
        @Params("category_slug") category_slug: string,
        @Res() res: Response,
        @Req("empresa") empresa: Empresas
    ) {
        const result = await this.webService.categories(category_slug, empresa);
        return res.render("web/shop/categories", result);
    }

    @Get("/shop/:category_slug/:subcategory_slug", [webEnabledMiddleware])
    async subcategories(
        @Params("category_slug") category_slug: string,
        @Params("subcategory_slug") subcategory_slug: string,
        @Res() res: Response,
        @Req("empresa") empresa: Empresas
    ) {
        const result = await this.webService.subcategories(
            category_slug,
            subcategory_slug,
            empresa
        );
        return res.render("web/shop/subcategories", result);
    }

    @Get("/marcas/:brand", [webEnabledMiddleware])
    async marcas(
        @Params("brand") brand: string,
        @Res() res: Response,
        @Req("empresa") empresa: Empresas
    ) {
        const result = await this.webService.marcas(brand, empresa);
        return res.render("web/shop/brands", result);
    }
    @Get("/nosotros", [webEnabledMiddleware])
    async about(@Res() res: Response, @Req("empresa") empresa: Empresas) {
        const result = await this.webService.about(empresa);
        return res.render("web/home/about", result);
    }

    @Get("/pedidos")
    async orders(@Res() res: Response) {
        const result = await this.webService.orders();
        return res.render("web/orders", result);
    }

    @Get("/politica-de-privacidad")
    async politica(@Res() res: Response, @Req("empresa") empresa: Empresas) {
        const result = await this.webService.politica(empresa);
        return res.render("web/politica/privacidad", result);
    }

    @Get("/terminos-y-condiciones")
    async terminos(@Res() res: Response, @Req("empresa") empresa: Empresas) {
        const result = await this.webService.terminos(empresa);
        return res.render("web/politica/terminos", result);
    }

    @Get("/libro-de-reclamaciones")
    async reclamaciones(
        @Res() res: Response,
        @Req("empresa") empresa: Empresas
    ) {
        const result = await this.webService.reclamaciones(empresa);
        return res.render("web/politica/reclamaciones", result);
    }
    @Get("/servicio/:slug")
    async servicio(
        @Params("slug") slug: string,
        @Res() res: Response,
        @Req("empresa") empresa: Empresas,
        @Req("user") user: Users
    ) {
        const result = await this.webService.servicio(slug, empresa, user);
        return res.render("web/servicio", result);
    }
    @Get("/:slug")
    async product(
        @Params("slug") slug: string,
        @Res() res: Response,
        @Req() req: RequestVigilio
    ) {
        const result = await this.webService.product(
            slug,
            req.empresa,
            req.user
        );
        return res.render("web/product", result);
    }

    @Pipe(objectAsync({ hash: string() }))
    @Get("/sh/:hash")
    async link(
        @Params("hash") hash: string,
        @Req("empresa") empresa: Empresas,
        @Res() res: Response
    ) {
        const { url } = await this.urlsService.show(empresa, hash);
        if (!url.enabled) {
            res.redirect("/");
            return;
        }

        res.redirect(url.web);
    }

    @Get("/goodbye")
    async goodbye(@Res() res: Response) {
        return res.send("<h1>goodbye!!!</h1>"); // no borrar
    }
}
