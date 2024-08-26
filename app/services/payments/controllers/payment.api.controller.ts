import {
    Body,
    Controller,
    Get,
    Injectable,
    Params,
    Post,
    Query,
    Req,
    Res,
} from "@vigilio/express-core";
import { PaymentApiService } from "../services/payment.api.service";
import type { InformationApiService } from "@/information/services/information.api.service";
import {
    ordersStoreDto,
    type OrdersStoreDto,
} from "@/orders/dtos/orders.store.dto";
import { Pipe, Validator } from "@vigilio/express-core/valibot";
import { objectAsync, string } from "@vigilio/valibot";
import type { RequestVigilio } from "~/config/types";
import type { Response } from "express";

@Injectable()
@Controller("/payment")
export class PaymentApiController {
    constructor(
        private readonly paymentApiService: PaymentApiService,
        private readonly informationApiService: InformationApiService
    ) {}

    @Validator(ordersStoreDto)
    @Pipe(
        objectAsync({
            slug: string(),
        })
    )
    @Post("/api/:slug/order")
    async order(@Params("slug") slug: string, @Body() body: OrdersStoreDto) {
        const result = await this.paymentApiService.order(slug, body);
        return result;
    }

    @Pipe(
        objectAsync({
            slug: string(),
        })
    )
    @Get("/:slug/success")
    async success(
        @Params("slug") slug: string,
        @Query("token") token: string,
        @Res() res: Response,
        @Req() req: RequestVigilio
    ) {
        if (!token) return res.redirect("/");
        try {
            const result = await this.paymentApiService.success(
                slug,
                token,
                req
            );
            return res.render("web/payment/paypal/success", result);
        } catch (error) {
            return res.redirect(
                `/paypal/${slug}/failed?message=${(error as Error).message}`
            );
        }
    }

    @Pipe(
        objectAsync({
            slug: string(),
        })
    )
    @Get("/:slug/cancel")
    async cancel(@Params("slug") slug: string, @Res() res: Response) {
        const { information } = await this.informationApiService.show(slug);
        return res.render("web/payment/paypal/cancel", { information });
    }

    @Pipe(
        objectAsync({
            slug: string(),
        })
    )
    @Get("/:slug/failure")
    async failed(
        @Params("slug") slug: string,
        @Res() res: Response,
        @Query("message") message: string
    ) {
        const { information } = await this.informationApiService.show(slug);
        if (!message) return res.redirect("/");
        return res.render("web/payment/paypal/failed", {
            title: "Pago no realizado correctamente",
            message,
            information,
        });
    }
}
