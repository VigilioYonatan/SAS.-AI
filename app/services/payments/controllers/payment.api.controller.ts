import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Injectable,
    Post,
    Query,
    Req,
    Res,
} from "@vigilio/express-core";
import { PaymentApiService } from "../services/payment.api.service";
import {
    ordersStoreDto,
    type OrdersStoreDto,
} from "@/orders/dtos/orders.store.dto";
import { Validator } from "@vigilio/express-core/valibot";
import type { RequestVigilio } from "~/config/types";
import type { Response } from "express";
import type { Empresas } from "@/empresas/entities/empresas.entity";

@Injectable()
@Controller("/payment")
export class PaymentApiController {
    constructor(private readonly paymentApiService: PaymentApiService) {}

    @Validator(ordersStoreDto)
    @Post("/api/order")
    async order(
        @Req("empresa") empresa: Empresas,
        @Body() body: OrdersStoreDto
    ) {
        const result = await this.paymentApiService.order(empresa, body);
        return result;
    }

    @Get("/success")
    async success(
        @Req("empresa") empresa: Empresas,
        @Query("token") token: string,
        @Res() res: Response
    ) {
        if (!token) return res.redirect("/");
        try {
            const result = await this.paymentApiService.success(empresa, token);
            return res.render("web/payment/paypal/success", result);
        } catch (error) {
            return res.redirect(
                `/paypal/failed?message=${(error as Error).message}`
            );
        }
    }
    @Post("/webhook")
    async webhook(
        @Query() query: { id: string; topic: string },
        @Req() req: RequestVigilio
    ) {
        const id = query.id;
        const type = query.topic;
        await this.paymentApiService.webhook(req, id, type);
    }

    @Get("/cancel")
    async cancel(@Req("empresa") empresa: Empresas, @Res() res: Response) {
        return res.render("web/payment/mercado_pago/cancel", {
            empresa,
            title: "Este pago ha sido cancelado.",
            description: "Este pago ha sido cancelado.",
        });
    }

    @Get("/failure")
    async failed(
        @Req() req: RequestVigilio,
        @Res() res: Response,
        @Query("preference_id") preference_id: string
    ) {
        if (!preference_id) throw new BadRequestException("unauthorized");
        const result = await this.paymentApiService.failed(req, preference_id);

        return res.render("web/payment/mercado_pago/failed", {
            title: "Pago no realizado correctamente",
            ...result,
        });
    }
}
