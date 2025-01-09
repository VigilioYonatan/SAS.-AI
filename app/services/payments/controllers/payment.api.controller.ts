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
import { initialMiddleware } from "@/web/middlewares/initial.middleware";

@Injectable()
@Controller("/payment")
export class PaymentApiController {
    constructor(private readonly paymentApiService: PaymentApiService) {}

    @Validator(ordersStoreDto)
    @Post("/api/order")
    async order(@Req() req: RequestVigilio, @Body() body: OrdersStoreDto) {
        const result = await this.paymentApiService.order(req, body);
        return result;
    }

    @Get("/success", [initialMiddleware])
    async success(
        @Req() req: RequestVigilio,
        @Query() query: { preference_id: string },
        @Res() res: Response
    ) {
        const empresa = req.empresa;
        const { preference_id } = query;

        if (!preference_id) return res.redirect("/");
        try {
            const result = await this.paymentApiService.success(
                empresa,
                preference_id
            );
            return res.render("web/payment/mercado_pago/success", result);
        } catch (error) {
            return res.redirect(
                `/payment/failure?message=${(error as Error).message}`
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

    @Get("/cancel", [initialMiddleware])
    async cancel(@Req("empresa") empresa: Empresas, @Res() res: Response) {
        return res.render("web/payment/mercado_pago/cancel", {
            empresa,
            title: "Este pago ha sido cancelado.",
            description: "Este pago ha sido cancelado.",
        });
    }

    @Get("/failure", [initialMiddleware])
    async failed(
        @Req() req: RequestVigilio,
        @Res() res: Response,
        @Query() query: { preference_id: string }
    ) {
        const { preference_id } = query;

        if (!preference_id) throw new BadRequestException("unauthorized");
        const result = await this.paymentApiService.failed(req, preference_id);

        return res.render("web/payment/mercado_pago/failed", {
            title: "Pago no realizado correctamente",
            ...result,
        });
    }
}
