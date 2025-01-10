import {
    Controller,
    Get,
    Query,
    Res,
    Injectable,
    Req,
    Params,
    BadRequestException,
    Redirect,
} from "@vigilio/express-core";
import type { Request, Response } from "express";
import { WebService } from "../services/web.service";
import { Empresas } from "@/empresas/entities/empresas.entity";
import { Pipe } from "@vigilio/express-core/valibot";
import { objectAsync, string } from "@vigilio/valibot";
import { UrlsService } from "@/urls/services/urls.service";
import type { RequestVigilio } from "~/config/types";
import { webEnabledMiddleware } from "../middlewares/webEnabled.middleware";
import type { Users } from "@/users/entities/users.entity";
import type { Money } from "@/empresas/libs";
import { initialMiddleware } from "../middlewares/initial.middleware";

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

    @Get("/", [initialMiddleware, webEnabledMiddleware])
    async home(@Res() res: Response, @Req() req: RequestVigilio) {
        const result = await this.webService.home(req.empresa, req.user);
        return res.render("web/home", result);
    }

    @Get("/404", [initialMiddleware])
    async page404(@Query("message") message: string, @Res() res: Response) {
        res.status(404);
        return res.render("web/404", {
            title: "404",
            message: message ?? "No se a encontrado esta página",
        });
    }

    @Get("/shop/:category_slug", [initialMiddleware, webEnabledMiddleware])
    async categories(
        @Params("category_slug") category_slug: string,
        @Res() res: Response,
        @Req("empresa") empresa: Empresas
    ) {
        if (!empresa.setting.isEccomerce) throw new Redirect("/");
        const result = await this.webService.categories(category_slug, empresa);
        return res.render("web/shop/categories", result);
    }

    @Get("/shop/:category_slug/:subcategory_slug", [
        webEnabledMiddleware,
        initialMiddleware,
    ])
    async subcategories(
        @Params("category_slug") category_slug: string,
        @Params("subcategory_slug") subcategory_slug: string,
        @Res() res: Response,
        @Req("empresa") empresa: Empresas
    ) {
        if (!empresa.setting.isEccomerce) throw new Redirect("/");
        const result = await this.webService.subcategories(
            category_slug,
            subcategory_slug,
            empresa
        );
        return res.render("web/shop/subcategories", result);
    }

    @Get("/marcas/:brand", [initialMiddleware, webEnabledMiddleware])
    async marcas(
        @Params("brand") brand: string,
        @Res() res: Response,
        @Req("empresa") empresa: Empresas
    ) {
        if (!empresa.setting.isEccomerce) throw new Redirect("/");
        const result = await this.webService.marcas(brand, empresa);
        return res.render("web/shop/brands", result);
    }

    @Get("/pedidos", [initialMiddleware])
    async orders(@Res() res: Response) {
        const result = await this.webService.orders();
        return res.render("web/orders", result);
    }

    @Get("/politica-de-privacidad", [initialMiddleware])
    async politica(@Res() res: Response, @Req("empresa") empresa: Empresas) {
        const result = await this.webService.politica(empresa);
        return res.render("web/politica/privacidad", result);
    }

    @Get("/terminos-y-condiciones", [initialMiddleware])
    async terminos(@Res() res: Response, @Req("empresa") empresa: Empresas) {
        const result = await this.webService.terminos(empresa);
        return res.render("web/politica/terminos", result);
    }

    @Get("/libro-de-reclamaciones", [initialMiddleware])
    async reclamaciones(
        @Res() res: Response,
        @Req("empresa") empresa: Empresas
    ) {
        const result = await this.webService.reclamaciones(empresa);
        return res.render("web/politica/reclamaciones", result);
    }
    @Get("/servicio/:slug", [initialMiddleware])
    async servicio(
        @Params("slug") slug: string,
        @Res() res: Response,
        @Req("empresa") empresa: Empresas,
        @Req("user") user: Users
    ) {
        const result = await this.webService.servicio(slug, empresa, user);
        return res.render("web/servicio", result);
    }
    @Get("/:slug", [initialMiddleware])
    async product(
        @Params("slug") slug: string,
        @Res() res: Response,
        @Req() req: RequestVigilio
    ) {
        const result = await this.webService.product(slug, req, req.user);

        if (!result.type_page) {
            return res.render("web/product", result);
        }

        if (result.type_page === "shop_page") {
            return res.render("web/shop", result);
        }
        if (result.type_page === "nosotros_page") {
            return res.render("web/home/about", result);
        }
        if (result.type_page === "servicios_page") {
            return res.render("web/servicios", result);
        }
        if (result.type_page === "contact_page") {
            return res.render("web/home/contact", result);
        }

        return res.render("web/home/others", result);
    }
    @Get("/:page/:slug", [initialMiddleware])
    async dynamic(
        @Params("slug") slug: string,
        @Params("page") page: string,
        @Req() req: RequestVigilio,
        @Res() res: Response
    ) {
        const result = await this.webService.dynamic(page, slug, req.empresa);
        return res.render("web/home/dynamic", result);
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
    @Get("/change-money/:money")
    async changeMoney(
        @Req() req: Request,
        @Res() res: Response,
        @Params("money") money: string
    ) {
        const rutaAnterior = req.get("Referer") as string;
        if (!(["DOLARES", "LOCAL"] as Money[]).includes(money as Money)) {
            return res.redirect(rutaAnterior);
        }
        res.cookie("money", money, { httpOnly: false });
        return res.redirect(rutaAnterior);
    }
    @Get("/auth/zoho/callback")
    async zoho(@Req() req: Request, @Res() res: Response) {
        return res.send(`<code>query:<br/>${JSON.stringify(req.query)}</code>`); // no borrar
    }
}
