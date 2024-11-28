import { Validator } from "@vigilio/express-core/valibot";
import {
    ordersStoreDto,
    type OrdersStoreDto,
} from "@/orders/dtos/orders.store.dto";
import { Body, Controller, Injectable, Post, Req } from "@vigilio/express-core";
import type { StripeApiService } from "../services/stripe.api.service";
import type { RequestVigilio } from "~/config/types";

@Injectable()
@Controller("/StripeApiService")
export class StripeApiServiceApiController {
    constructor(private readonly stripeApiService: StripeApiService) {}

    @Validator(ordersStoreDto)
    @Post("/order")
    async StripeApiService(
        @Body() body: OrdersStoreDto,
        @Req() req: RequestVigilio
    ) {
        const result = await this.stripeApiService.order(body, req);
        return result;
    }

    // @Post("/validate")
    // async StripeApiServiceValidate(
    //     @Body() body: KRStripeApiServiceResponse,
    //     @Req() req: RequestVigilio
    // ) {
    //     const information = req.empresa!;
    //     const result = await this.stripeApiService.StripeApiServiceValidate(
    //         body,
    //         information,
    //         req
    //     );
    //     return result;
    // }
}
