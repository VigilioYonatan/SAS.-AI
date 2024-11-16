import {
	Controller,
	Get,
	Query,
	Res,
	Injectable,
	Params,
	Req,
} from "@vigilio/express-core";
import { CartService } from "../services/cart.service";
import type { Response } from "express";
import { Pipe } from "@vigilio/express-core/valibot";
import { objectAsync, string } from "@vigilio/valibot";
import { UrlsPayment } from "@/urls/entities/urls.payment.entity";
import type { Empresas } from "@/empresas/entities/empresas.entity";
import { NOW, restarDays } from "~/libs/dayjs";
import type { Users } from "@/users/entities/users.entity";

@Injectable()
@Controller("/cart")
export class CartController {
	constructor(private readonly cartService: CartService) {}
	@Get("/")
	async index(@Res() res: Response, @Query("items") items: string) {
		let itemsResult:
			| { id: number; quantity: number; variant?: number }[]
			| null = null;
		if (items) {
			try {
				itemsResult = JSON.parse(items) as {
					id: number;
					quantity: number;
					variant?: number;
				}[];
			} catch (error) {
				return res.redirect("/");
			}
		}
		const result = await this.cartService.index(itemsResult);
		return res.render("web/cart", result);
	}

	@Get("/servicio/:slug")
	async servicio(
		@Res() res: Response,
		@Req("empresa") empresa: Empresas,
		@Params("slug") slug: string,
		@Req("user") user: Users,
	) {
		const result = await this.cartService.servicio(empresa, slug, user);
		return res.render("web/cart/servicio", result);
	}
	@Pipe(objectAsync({ hash: string() }))
	@Get("/:hash")
	async url(
		@Params("hash") hash: string,
		@Res() res: Response,
		@Req("empresa") empresa: Empresas,
	) {
		const urls = await UrlsPayment.findOne({
			where: {
				hash,
				empresa_id: empresa.id,
			},
		});
		if (!urls || restarDays(empresa, NOW(empresa).format(), urls.time) <= 0)
			return res.redirect("/");

		return res.redirect(urls.url);
	}
}
