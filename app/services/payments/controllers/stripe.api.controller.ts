import { Validator } from "@vigilio/express-core/valibot";
import {
	ordersStoreDto,
	type OrdersStoreDto,
} from "@/orders/dtos/orders.store.dto";
import { Body, Controller, Injectable, Post, Req } from "@vigilio/express-core";
import type { Empresas } from "@/empresas/entities/empresas.entity";
import type { StripeApiService } from "../services/stripe.api.service";

@Injectable()
@Controller("/StripeApiService")
export class StripeApiServiceApiController {
	constructor(private readonly stripeApiService: StripeApiService) {}

	@Validator(ordersStoreDto)
	@Post("/order")
	async StripeApiService(
		@Body() body: OrdersStoreDto,
		@Req("empresa") empresa: Empresas,
	) {
		const result = await this.stripeApiService.order(body, empresa);
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
