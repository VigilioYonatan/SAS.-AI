import { type Type } from "@vigilio/express-core";
import { WebController } from "@/web/controllers/web.controller";
import { CartController } from "@/cart/controllers/cart.controller";
import { PaymentApiController } from "@/payments/controllers/payment.api.controller";
import { PaypalController } from "@/payments/controllers/paypal.controller";

export const webRouters: Type[] = [
	CartController,
	WebController,
	PaymentApiController,
	PaypalController,
];
