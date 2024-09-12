import {
	Controller,
	Get,
	Query,
	Res,
	Injectable,
	Req,
	Params,
} from "@vigilio/express-core";
import type { Response } from "express";
import { WebService } from "../services/web.service";
import { Empresas } from "@/empresas/entities/empresas.entity";
import { Pipe } from "@vigilio/express-core/valibot";
import { objectAsync, string } from "@vigilio/valibot";
import { UrlsService } from "@/urls/services/urls.service";

@Injectable()
@Controller("/")
export class WebController {
	constructor(
		private readonly webService: WebService,
		private readonly urlsService: UrlsService,
	) {}
	@Get("/hello-world")
	async helloworld(@Res() res: Response) {
		return res.send("<h1>Hello World!!!</h1>"); // no borrar
	}

	@Get("/")
	async home(@Res() res: Response, @Req("empresa") empresa: Empresas) {
		const result = await this.webService.home(empresa);
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
	@Get("/shop")
	async shop(@Res() res: Response, @Req("empresa") empresa: Empresas) {
		const result = await this.webService.shop(empresa);
		return res.render("web/shop", result);
	}

	@Get("/shop/:category_slug")
	async categories(
		@Params("category_slug") category_slug: string,
		@Res() res: Response,
		@Req("empresa") empresa: Empresas,
	) {
		const result = await this.webService.categories(category_slug, empresa);
		return res.render("web/shop/categories", result);
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
	async reclamaciones(@Res() res: Response, @Req("empresa") empresa: Empresas) {
		const result = await this.webService.reclamaciones(empresa);
		return res.render("web/politica/reclamaciones", result);
	}
	@Get("/:slug")
	async product(
		@Params("slug") slug: string,
		@Res() res: Response,
		@Req("empresa") empresa: Empresas,
	) {
		const result = await this.webService.product(slug, empresa);
		return res.render("web/product", result);
	}

	@Pipe(objectAsync({ hash: string() }))
	@Get("/sh/:hash")
	async link(@Params("hash") hash: string, @Res() res: Response) {
		const { url } = await this.urlsService.show(hash);
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
