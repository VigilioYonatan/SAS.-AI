import {
    Body,
    Controller,
    Get,
    Params,
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
import { EmpresasApiService } from "@/empresas/services/empresas.api.service";
import type { Empresas } from "@/empresas/entities/empresas.entity";

@Injectable()
@Controller("/paypal")
export class PaypalController {
    constructor(
        private readonly paypalService: PaypalService,
        private readonly empresasApiService: EmpresasApiService
    ) {}

    @Validator(ordersStoreDto)
    @Post("/api/order")
    async order(
        @Params("empresa") empresa: Empresas,
        @Body() body: OrdersStoreDto
    ) {
        const result = await this.paypalService.order(empresa, body);
        return result;
    }

    @Get("/success")
    async success(
        @Params("empresa") empresa: Empresas,
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
    async cancel(@Params("empresa") empresa: Empresas, @Res() res: Response) {
        return res.render("web/payment/paypal/cancel", { empresa });
    }

    @Get("/failed")
    async failed(
        @Params("empresa") empresa: Empresas,
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
