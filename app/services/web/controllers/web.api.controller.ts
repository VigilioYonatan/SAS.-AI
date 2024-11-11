import {
	Controller,
	Get,
	Res,
	Injectable,
	Req,
	Params,
} from "@vigilio/express-core";
import type { Response } from "express";
import { Empresas } from "@/empresas/entities/empresas.entity";
import { webEnabledMiddleware } from "../middlewares/webEnabled.middleware";
import { WebApiService } from "../services/web.api.service";
import type { RequestVigilio } from "~/config/types";
import type { Users } from "@/users/entities/users.entity";

@Injectable()
@Controller("/web")
export class WebApiController {
	constructor(private readonly webApiService: WebApiService) {}

	@Get("/", [webEnabledMiddleware])
	async home(@Res() res: Response, @Req() req: RequestVigilio) {
		const result = await this.webApiService.home(req.empresa, req.user);
		return res.render("web/home", result);
	}

	@Get("/shop", [webEnabledMiddleware])
	async shop(
		@Res() res: Response,
		@Req("empresa") empresa: Empresas,
		@Req("user") user: Users,
	) {
		const result = await this.webApiService.shop(empresa, user);
		return res.render("web/shop", result);
	}

	@Get("/shop/:category_slug", [webEnabledMiddleware])
	async categories(
		@Params("category_slug") category_slug: string,
		@Res() res: Response,
		@Req("empresa") empresa: Empresas,
	) {
		const result = await this.webApiService.categories(category_slug, empresa);
		return res.render("web/shop/categories", result);
	}

	@Get("/marcas/:brand", [webEnabledMiddleware])
	async marcas(
		@Params("brand") brand: string,
		@Res() res: Response,
		@Req("empresa") empresa: Empresas,
	) {
		const result = await this.webApiService.marcas(brand, empresa);
		return res.render("web/shop/brands", result);
	}
	@Get("/nosotros", [webEnabledMiddleware])
	async about(@Res() res: Response, @Req("empresa") empresa: Empresas) {
		const result = await this.webApiService.about(empresa);
		return res.render("web/home/about", result);
	}

	@Get("/servicio/:slug")
	async servicio(
		@Params("slug") slug: string,
		@Res() res: Response,
		@Req("empresa") empresa: Empresas,
		@Req("user") user: Users,
	) {
		const result = await this.webApiService.servicio(slug, empresa, user);
		return res.render("web/servicio", result);
	}
	@Get("/:slug")
	async product(
		@Params("slug") slug: string,
		@Res() res: Response,
		@Req("empresa") empresa: Empresas,
		@Req("user") user: Users,
	) {
		const result = await this.webApiService.product(slug, empresa, user);
		return res.render("web/product", result);
	}
}
