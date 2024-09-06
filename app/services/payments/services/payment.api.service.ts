import type { InformationEntity } from "@/information/entities/information.entity";
import type { MetodosPago } from "@/information/entities/metodosPago.entity";
import { BASE_URL } from "@/information/libs";
import type { OrdersStoreDto } from "@/orders/dtos/orders.store.dto";
import { OrdersApiService } from "@/orders/services/orders.api.service";
import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from "@vigilio/express-core";
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import enviroments from "~/config/enviroments.config";
import { pasarelaComision } from "../libs";
import { STATUSORDER } from "@/orders/libs";
import type { OrdersUpdateDto } from "@/orders/dtos/orders.update.dto";
import type { RequestVigilio } from "~/config/types";
import { Orders } from "@/orders/entities/orders.entity";

@Injectable()
export class PaymentApiService {
	constructor(private readonly ordersApiService: OrdersApiService) {}
	async order(information: InformationEntity, orderStore: OrdersStoreDto) {
		const metodosPago = (await information.$get("metodos_pago")) as MetodosPago;
		if (!metodosPago.mercado_pago.enabled || !metodosPago.mercado_pago.token)
			throw new BadRequestException("No disponible");
		const client = new MercadoPagoConfig({
			accessToken:
				enviroments.NODE_ENV === "production"
					? metodosPago.mercado_pago.token
					: "APP_USR-3342311965488736-090501-7e8525ddf34cfd6848d141817ec7bb96-1975993637",
			options: {
				timeout: 1000, // Puedes configurar opciones adicionales como el tiempo de espera
			},
		});
		const payment = new Preference(client);
		try {
			const { order } = await this.ordersApiService.store(
				orderStore,
				information,
			);

			const total = information.enabledClientPayComision
				? (order.total + pasarelaComision(information, order.total)).toFixed(2)
				: order.total.toFixed(2);
			const result = await payment.create({
				body: {
					items: [
						{
							id: order.order_code,
							title: `${information.name_empresa} - Pedido ${order.order_code}`,
							unit_price: Number(total),
							quantity: 1,
						},
					],
					back_urls: {
						success: `${BASE_URL(information)}/payment/success`,
						failure: `${BASE_URL(information)}/payment/failure`,
						pending: `${BASE_URL(information)}/payment/pending`,
					},
					notification_url: `${BASE_URL(information)}/payment/webhook`,
				},
			});
			await order.update({ mercado_pago_token: result.id });
			return { success: true, result };
		} catch (error) {
			throw new BadRequestException(
				`Error al procesar el pago, ${(error as Error).message}`,
			);
		}
	}

	async webhook(req: RequestVigilio, id: string, type: string) {
		if (type === "payment") {
			const information = req.information;
			const metodosPago = (await req.information.$get(
				"metodos_pago",
			)) as MetodosPago;
			if (!metodosPago.mercado_pago.enabled || !metodosPago.mercado_pago.token)
				throw new BadRequestException("No disponible");
			try {
				const payment = new Payment({
					accessToken:
						enviroments.NODE_ENV === "production"
							? metodosPago.mercado_pago.token
							: "APP_USR-3342311965488736-090501-7e8525ddf34cfd6848d141817ec7bb96-1975993637",
				});
				const pago = await payment.get({ id });
				if (pago.status === "") {
					const code = pago.additional_info!.items![0].id;
					const { order } = await this.ordersApiService.show(information, code);
					await this.ordersApiService.update({
						order_code: order.order_code,
						ordersUpdateDto: {
							...order.toJSON(),
							status_order_id: STATUSORDER.pagado,
							note: null,
							send_message: information.enabledSendMessage, // enviar mensaje a whatsapp
							invoice: {
								...order.dataValues.invoice.toJSON(),
								sendMessage: true,
								send_sunat: information.enabledSendSunat, // enviar a sunat
							},
							paypal_response: pago,
							description: "Pago realizado correctamente",
						} as OrdersUpdateDto,
						req,
					});
				}
			} catch (error) {
				throw new InternalServerErrorException("Error de capturar pago");
			}
		}
	}
	async success() {}
	async failed(req: RequestVigilio, preference_id: string) {
		try {
			const order = await Orders.findOne({
				where: {
					information_id: req.information.id,
					mercado_pago_token: preference_id,
				},
			});
			if (!order) throw new BadRequestException("No order found");
			const description = "No se realizado el pago correctamente.";
			await this.ordersApiService.update({
				order_code: order.order_code,
				ordersUpdateDto: {
					...order.toJSON(),
					status_order_id: STATUSORDER.problema,
					note: null,
					invoice: null,
					send_message: false,
					description,
				} as OrdersUpdateDto,
				req,
			});
			return { order: order.order_code, description };
		} catch (error) {
			throw new InternalServerErrorException("Error ");
		}
	}
}
