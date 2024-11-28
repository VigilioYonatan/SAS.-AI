import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    Req,
    Res,
} from "@vigilio/express-core";
import { Injectable } from "@vigilio/express-core";
import { PaypalService } from "../services/paypal.service";
import type { Response } from "express";
import { Validator } from "@vigilio/express-core/valibot";
import {
    ordersStoreDto,
    type OrdersStoreDto,
} from "@/orders/dtos/orders.store.dto";
import type { RequestVigilio } from "~/config/types";
import type { Empresas } from "@/empresas/entities/empresas.entity";

@Injectable()
@Controller("/paypal")
export class PaypalController {
    constructor(private readonly paypalService: PaypalService) {}

    @Validator(ordersStoreDto)
    @Post("/api/order")
    async order(@Req() req: RequestVigilio, @Body() body: OrdersStoreDto) {
        const result = await this.paypalService.order(req, body);
        return result;
    }

    @Get("/success")
    async success(
        @Req("empresa") empresa: Empresas,
        @Query("token") token: string,
        @Res() res: Response,
        @Req() req: RequestVigilio
    ) {
        if (!token) return res.redirect("/");
        try {
            const result = await this.paypalService.success(
                empresa,
                token,
                req
            );
            return res.render("web/payment/paypal/success", result);
        } catch (error) {
            return res.redirect(
                `/paypal/failed?message=${(error as Error).message}`
            );
        }
    }

    @Get("/cancel")
    async cancel(@Req("empresa") empresa: Empresas, @Res() res: Response) {
        return res.render("web/payment/paypal/cancel", {
            empresa,
            title: "Cancelado",
            description: "Pago Cancelado.",
        });
    }

    @Get("/failed")
    async failed(
        @Req("empresa") empresa: Empresas,
        @Res() res: Response,
        @Query("message") message: string
    ) {
        if (!message) return res.redirect("/");
        return res.render("web/payment/paypal/failed", {
            title: "Pago no realizado correctamente",
            message,
            empresa,
        });
    }
}
