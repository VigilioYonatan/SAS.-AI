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
    @Pipe(objectAsync({ hash: string() }))
    @Get("/:hash")
    async url(
        @Params("hash") hash: string,
        @Res() res: Response,
        @Req("empresa") empresa: Empresas
    ) {
        const urls = await UrlsPayment.findOne({
            where: {
                hash,
                empresa_id: empresa.id,
            },
        });
        if (!urls || restarDays(NOW(empresa).toDate(), urls.time) <= 0)
            return res.redirect("/");

        return res.redirect(urls.url);
    }
}
