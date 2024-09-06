import { Injectable, NotFoundException } from "@vigilio/express-core";
import { BadRequestException } from "@vigilio/express-core";
import { OrdersApiService } from "@/orders/services/orders.api.service";
import { Orders } from "@/orders/entities/orders.entity";
import { STATUSORDER } from "@/orders/libs";
import enviroments from "~/config/enviroments.config";
import { paypal } from "@vigilio/payments";
import { paypalComision } from "../libs";
import { EmpresasApiService } from "@/empresas/services/empresas.api.service";
import { converterMoneyApi } from "~/libs/apis";
import type { OrdersStoreDto } from "@/orders/dtos/orders.store.dto";
import type { OrdersUpdateDto } from "@/orders/dtos/orders.update.dto";
import type { RequestVigilio } from "~/config/types";
import type { MetodosPago } from "@/empresas/entities/metodosPago.entity";
import { BASE_URL } from "@/empresas/libs";

@Injectable()
export class PaypalService {
    constructor(
        private readonly ordersApiService: OrdersApiService,
        private readonly empresasApiService: EmpresasApiService
    ) {}
    async order(slug: string, body: OrdersStoreDto) {
        const { empresa } = await this.empresasApiService.show(slug);
        const from = empresa.money.simbolo;
        const response = await converterMoneyApi({
            amount: "1",
            from,
            to: "USD",
        });
        const value = Number.parseFloat(response.result.todayNumber); // its necesary to fix
        const metodo = (await empresa.$get("metodos_pago")) as MetodosPago;
        if (
            !metodo.paypal.enabled ||
            !metodo.paypal.paypal_client_id ||
            !metodo.paypal.paypal_secret_key
        )
            throw new BadRequestException("No disponible en este momento");
        const total = empresa.enabledClientPayComision
            ? paypalComision(body.total, value).toFixed(2)
            : (body.total / value).toFixed(2);
        const { createOrder } = paypal({
            client_id:
                enviroments.NODE_ENV === "production"
                    ? metodo.paypal.paypal_client_id
                    : "AdAUJtqTTHeXqxRvut3TvNlCMSbUfWNoS_Xkq1mXmQaP1jvzUEtvdktdewxGaWXkjkP7N8BzaUu4j4ay",
            secret_key:
                enviroments.NODE_ENV === "production"
                    ? metodo.paypal.paypal_secret_key
                    : "EEqnW3MIBx9rKvmKmOrmX3SWOvFC3hUVKzdEPBq7HQ78jdigXLun14wEIizoaZcbD13E1xO8NQfdx7Ba",
            sandbox:
                enviroments.NODE_ENV === "production"
                    ? "https://api-m.paypal.com"
                    : enviroments.PAYPAL_SANDBOX,
        });

        const result = await createOrder({
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: total,
                    },
                },
            ],
            application_context: {
                brand_name: empresa!.name_empresa,
                // payment_method: "IMMEDIATE_PAYMENT_REQUIRED",
                // locale: "en-US",
                landing_page: "NO_PREFERENCE",
                // shipping_preference: "SET_PROVIDED_ADDRESS",
                user_action: "PAY_NOW",
                //!
                return_url: `${BASE_URL(empresa)}/paypal/success`,
                cancel_url: `${BASE_URL(empresa)}/paypal/cancel`,
            },
        });

        if (result.status !== "CREATED")
            throw new BadRequestException(
                "Hubo un problema al realizar esta orden. Intentalo de nuevo más tarde."
            );

        await this.ordersApiService.store(
            {
                ...body,
                paypal_token: result.id,
                status_order_id: STATUSORDER.pendiente,
            } as OrdersStoreDto,
            empresa,
            value
        );

        return { success: true, result };
    }
    async success(slug: string, token: string, req: RequestVigilio) {
        const { empresa } = await this.empresasApiService.show(slug);
        const order = await Orders.findOne({
            where: {
                paypal_token: token,
            },
        });
        if (!order) throw new NotFoundException("Orden no encontrado.");
        let result = null;
        try {
            const metodoPago = (await empresa.$get(
                "metodos_pago"
            )) as MetodosPago;
            if (
                !metodoPago.paypal.enabled ||
                !metodoPago.paypal.paypal_client_id ||
                !metodoPago.paypal.paypal_secret_key
            )
                throw new BadRequestException("No disponible en este momento");
            const { captureOrder } = paypal({
                client_id: metodoPago.paypal.paypal_client_id,
                secret_key: metodoPago.paypal.paypal_secret_key,
                sandbox: enviroments.PAYPAL_SANDBOX,
            });
            result = await captureOrder(token);
            if (!result.status || result.status !== "COMPLETED") {
                throw new Error(
                    result.details[0].description ??
                        "No se realizó el pago correctamente."
                );
            }
        } catch (error) {
            if (order.status_order_id !== STATUSORDER.pagado) {
                await order.update({
                    status_order_id: STATUSORDER.problema,
                    paypal_response: (error as Error).message,
                    description: (error as Error).message,
                });
            }
            throw new Error((error as Error).message);
        }
        const { order: orderShow } = await this.ordersApiService.show(
            empresa,
            order.order_code
        );
        await this.ordersApiService.update({
            order_code: order.order_code,
            ordersUpdateDto: {
                ...orderShow.toJSON(),
                status_order_id: STATUSORDER.pagado,
                note: null,
                send_message: empresa.enabledSendMessage, // enviar mensaje a whatsapp
                invoice: {
                    ...orderShow.dataValues.invoice.toJSON(),
                    sendMessage: true,
                    send_sunat: empresa.enabledSendSunat, // enviar a sunat
                },
                paypal_response: result,
                description: "Pago realizado correctamente",
            } as OrdersUpdateDto,
            req,
        });

        // aca el pago realizado
        return {
            title: "Pago realizado correctamente.",
            order,
        };
    }

    async failed() {}
}
