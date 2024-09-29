import type { Empresas } from "@/empresas/entities/empresas.entity";
import type { MetodosPago } from "@/empresas/entities/metodosPago.entity";
import { BASE_URL } from "@/empresas/libs";
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
    async order(empresa: Empresas, orderStore: OrdersStoreDto) {
        const metodosPago = (await empresa.$get("metodos_pago")) as MetodosPago;
        if (
            !metodosPago.mercado_pago.enabled ||
            !metodosPago.mercado_pago.token
        )
            throw new BadRequestException("No disponible");
        const client = new MercadoPagoConfig({
            accessToken:
                enviroments.NODE_ENV === "production"
                    ? metodosPago.mercado_pago.token
                    : "APP_USR-292981138862703-092822-84632d11bca71d4ca5683f29034b2412-1591003666",
            options: {
                timeout: 5000, // Puedes configurar opciones adicionales como el tiempo de espera
            },
        });
        const payment = new Preference(client);
        try {
            const { order } = await this.ordersApiService.store(
                orderStore,
                empresa
            );

            const total = empresa.enabledClientPayComision
                ? (
                      order.total + pasarelaComision(empresa, order.total)
                  ).toFixed(2)
                : order.total.toFixed(2);
            const result = await payment.create({
                body: {
                    items: [
                        {
                            id: order.order_code,
                            title: `${empresa.name_empresa} - Pedido ${order.order_code}`,
                            unit_price: Number(total),
                            quantity: 1,
                        },
                    ],
                    back_urls: {
                        success: `${BASE_URL(empresa)}/payment/success`,
                        failure: `${BASE_URL(empresa)}/payment/failure`,
                        pending: `${BASE_URL(empresa)}/payment/pending`,
                    },
                    notification_url: `${BASE_URL(empresa)}/payment/webhook`,
                },
            });
            await order.update({ mercado_pago_token: result.id });
            return { success: true, result };
        } catch (error) {
            throw new BadRequestException(
                `Error al procesar el pago, ${(error as Error).message}`
            );
        }
    }

    async webhook(req: RequestVigilio, id: string, type: string) {
        console.log({ type });

        if (type === "payment") {
            const empresa = req.empresa;
            const metodosPago = (await req.empresa.$get(
                "metodos_pago"
            )) as MetodosPago;
            if (
                !metodosPago.mercado_pago.enabled ||
                !metodosPago.mercado_pago.token
            )
                throw new BadRequestException("No disponible");
            try {
                const payment = new Payment({
                    accessToken:
                        enviroments.NODE_ENV === "production"
                            ? metodosPago.mercado_pago.token
                            : "APP_USR-292981138862703-092822-84632d11bca71d4ca5683f29034b2412-1591003666",
                });
                const pago = await payment.get({ id });
                console.log({ pago });

                if (pago.status === "") {
                    const code = pago.additional_info!.items![0].id;
                    const { order } = await this.ordersApiService.show(
                        empresa,
                        code
                    );
                    await this.ordersApiService.update({
                        order_code: order.order_code,
                        ordersUpdateDto: {
                            ...order.toJSON(),
                            status_order_id: STATUSORDER.pagado,
                            note: null,
                            send_message: empresa.enabledSendMessage, // enviar mensaje a whatsapp
                            invoice: {
                                ...order.dataValues.invoice.toJSON(),
                                sendMessage: true,
                                send_sunat: empresa.enabledSendSunat, // enviar a sunat
                            },
                            paypal_response: pago,
                            description: "Pago realizado correctamente",
                        } as OrdersUpdateDto,
                        req,
                    });
                }
            } catch (error) {
                throw new InternalServerErrorException(
                    "Error de capturar pago"
                );
            }
        }
    }
    async success(empresa: Empresas, token: string) {
        const order = await Orders.findOne({
            where: {
                empresa_id: empresa.id,
                mercado_pago_token: token,
            },
        });
        if (!order) throw new BadRequestException("No order found");
        return {
            title: `${order.order_code} Se realizo el pago correctamente`,
            description: "Se realizo el pago correctamente",
            order: order.order_code,
        };
    }

    async failed(req: RequestVigilio, preference_id: string) {
        try {
            const order = await Orders.findOne({
                where: {
                    empresa_id: req.empresa.id,
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
