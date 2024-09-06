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
import { InformationApiService } from "@/information/services/information.api.service";
import {
	ordersStoreDto,
	type OrdersStoreDto,
} from "@/orders/dtos/orders.store.dto";
import { Validator } from "@vigilio/express-core/valibot";
import type { RequestVigilio } from "~/config/types";
import type { Response } from "express";
import type { InformationEntity } from "@/information/entities/information.entity";

@Injectable()
@Controller("/payment")
export class PaymentApiController {
	constructor(
		private readonly paymentApiService: PaymentApiService,
		private readonly informationApiService: InformationApiService,
	) {}

	@Validator(ordersStoreDto)
	@Post("/api/order")
	async order(
		@Req("information") information: InformationEntity,
		@Body() body: OrdersStoreDto,
	) {
		const result = await this.paymentApiService.order(information, body);
		return result;
	}

	@Get("/success")
	async success(
		@Req("information") _information: InformationEntity,
		@Query("token") token: string,
		@Res() res: Response,
		@Req() _req: RequestVigilio,
	) {
		if (!token) return res.redirect("/");
		// try {
		//     const result = await this.paymentApiService.success(
		//         information,
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
		@Req() req: RequestVigilio,
	) {
		await this.paymentApiService.webhook(req, id, type);
	}

	@Get("/cancel")
	async cancel(@Params("slug") slug: string, @Res() res: Response) {
		const { information } = await this.informationApiService.show(slug);
		return res.render("web/payment/mercado_pago/cancel", { information });
	}

	@Get("/failure")
	async failed(
		@Req() req: RequestVigilio,
		@Res() res: Response,
		@Query("preference_id") preference_id: string,
	) {
		if (!preference_id) throw new BadRequestException("unauthorized");
		const result = await this.paymentApiService.failed(req, preference_id);

		return res.render("web/payment/mercado_pago/failed", {
			title: "Pago no realizado correctamente",
			...result,
		});
	}
}
