import { OrdersApiService } from "@/orders/services/orders.api.service";
import type { OrdersStoreDto } from "@/orders/dtos/orders.store.dto";
import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from "@vigilio/express-core";
import type { Empresas } from "@/empresas/entities/empresas.entity";
import type { MetodosPago } from "@/empresas/entities/metodosPago.entity";
import Stripe from "stripe";

@Injectable()
export class StripeApiService {
	constructor(private readonly ordersApiService: OrdersApiService) {}
	//! https://github.com/fazt/nodejs-stripe-checkout/blob/master/src/controllers/payment.controller.js
	// validar crear orden
	async order(body: OrdersStoreDto, empresa: Empresas) {
		const metodosPago = (await empresa.$get("metodos_pago")) as MetodosPago;
		if (
			!metodosPago.stripe.stripe_client_secret ||
			!metodosPago.stripe.stripe_secret_key
		) {
			throw new BadRequestException("Error stripe es requerido");
		}
		try {
			// crear orden
			const { order: orderStore } = await this.ordersApiService.store(
				body,
				empresa,
				"stripe",
				1,
				{
					pasarela_comision: true,
				},
			);
			const stripe = new Stripe(metodosPago.stripe.stripe_secret_key);
			const paymentIntent = await stripe.checkout.sessions.create({
				line_items: [
					{
						price_data: {
							product_data: {
								name: orderStore.order_code,
								description: `Pedido ${orderStore.order_code} - ${empresa.name_empresa}`,
							},
							currency: "eur",
							unit_amount: Number.parseInt(orderStore.total.toFixed(2)) * 100, // obligatorio 100.00
						},
						quantity: 1,
					},
				],
				mode: "payment",
			});
			return {
				success: true,
				order: orderStore,
				url: paymentIntent.url,
			};
		} catch (error) {
			throw new InternalServerErrorException("Error de server");
		}
	}
	// validar stripe

	// async success(empresa: Empresas, token: string, req: RequestVigilio) {
	//     const order = await Orders.findOne({
	//         where: {
	//             paypal_token: token,
	//         },
	//     });
	//     if (!order) throw new NotFoundException("Orden no encontrado.");
	//     let result = null;
	//     try {
	//         const metodoPago = (await empresa.$get(
	//             "metodos_pago"
	//         )) as MetodosPago;
	//         if (
	//             !metodoPago.paypal.enabled ||
	//             !metodoPago.paypal.paypal_client_id ||
	//             !metodoPago.paypal.paypal_secret_key
	//         )
	//             throw new BadRequestException("No disponible en este momento");
	//         const { captureOrder } = paypal({
	//             client_id: metodoPago.paypal.paypal_client_id,
	//             secret_key: metodoPago.paypal.paypal_secret_key,
	//             sandbox:
	//                 enviroments.NODE_ENV === "production"
	//                     ? "https://api-m.paypal.com"
	//                     : enviroments.PAYPAL_SANDBOX,
	//         });
	//         result = await captureOrder(token);
	//         if (!result.status || result.status !== "COMPLETED") {
	//             throw new Error(
	//                 result.details[0].description ??
	//                     "No se realizó el pago correctamente."
	//             );
	//         }
	//     } catch (error) {
	//         if (order.status_order_id !== STATUSORDER.pagado) {
	//             await order.update({
	//                 status_order_id: STATUSORDER.problema,
	//                 paypal_response: (error as Error).message,
	//                 description: (error as Error).message,
	//             });
	//         }
	//         throw new Error((error as Error).message);
	//     }
	//     const { order: orderShow } = await this.ordersApiService.show(
	//         empresa,
	//         order.order_code
	//     );
	//     await this.ordersApiService.update({
	//         order_code: order.order_code,
	//         ordersUpdateDto: {
	//             ...orderShow.toJSON(),
	//             status_order_id: STATUSORDER.pagado,
	//             note: null,
	//             send_message: empresa.enabledSendMessage, // enviar mensaje a whatsapp
	//             invoice: {
	//                 ...orderShow.dataValues.invoice.toJSON(),
	//                 sendMessage: true,
	//                 send_sunat: empresa.enabledSendSunat, // enviar a sunat
	//             },
	//             paypal_response: result,
	//             description: "Pago realizado correctamente",
	//         } as OrdersUpdateDto,
	//         req,
	//     });

	//     // aca el pago realizado
	//     return {
	//         title: "Pago realizado correctamente.",
	//         order,
	//         description: "Pago Realizado correctamente",
	//     };
	// }

	// async failed() {
	//     return {
	//         title: "Pago realizado correctamente.",
	//         description: "Pago Realizado correctamente",
	//     };
	// }
}
