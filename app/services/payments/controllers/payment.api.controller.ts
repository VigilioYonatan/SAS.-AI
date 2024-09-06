import {
    BadRequestException,
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
import { EmpresasApiService } from "@/empresas/services/empresas.api.service";
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
    constructor(
        private readonly paymentApiService: PaymentApiService,
        private readonly empresasApiService: EmpresasApiService
    ) {}

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
        @Req("empresa") _empresa: Empresas,
        @Query("token") token: string,
        @Res() res: Response,
        @Req() _req: RequestVigilio
    ) {
        if (!token) return res.redirect("/");
        // try {
        //     const result = await this.paymentApiService.success(
        //         empresa,
        //         token,
        //         req
        //     );
        //     return res.render("web/payment/paypal/success", result);
        // } catch (error) {
        //     return res.redirect(
        //         `/paypal/${slug}/failed?message=${(error as Error).message}`
        //     );
        // }
    }
    @Post("/webhook")
    async webhook(
        @Query("data.id") id: string,
        @Query("type") type: string,
        @Req() req: RequestVigilio
    ) {
        await this.paymentApiService.webhook(req, id, type);
    }

    @Get("/cancel")
    async cancel(@Params("slug") slug: string, @Res() res: Response) {
        const { empresa } = await this.empresasApiService.show(slug);
        return res.render("web/payment/mercado_pago/cancel", { empresa });
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
