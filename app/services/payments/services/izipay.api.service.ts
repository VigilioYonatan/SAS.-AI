import { OrdersApiService } from "@/orders/services/orders.api.service";
import { STATUSORDER } from "@/orders/libs";
import type { Request } from "express";
import Hex from "crypto-js/enc-hex";
import hmacSHA256 from "crypto-js/hmac-sha256";
import type { OrdersStoreDto } from "@/orders/dtos/orders.store.dto";
import type { Orders } from "@/orders/entities/orders.entity";
import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from "@vigilio/express-core";
import type { Empresas } from "@/empresas/entities/empresas.entity";
import { MetodosPago } from "@/empresas/entities/metodosPago.entity";
import type { KRIzipayResponse } from "../controllers/izipay.api.controller";
import { pasarelaComision } from "../libs";
import type { RequestVigilio } from "~/config/types";

@Injectable()
export class IzipayApiService {
    constructor(private readonly ordersApiService: OrdersApiService) {}

    // validar crear orden
    async izipay(body: OrdersStoreDto, req: RequestVigilio) {
        const empresa = req.empresa;
        const metodosPago = await MetodosPago.findOne({
            where: {
                empresa_id: empresa.id,
            },
        });
        if (
            !metodosPago?.izipay.izipay_client_id ||
            !metodosPago?.izipay.izipay_client_secret ||
            !metodosPago?.izipay.izipay_hash_key ||
            !metodosPago?.izipay.izipay_public_key
        ) {
            throw new BadRequestException("Error izipay es requerido");
        }
        try {
            const currency = "PEN"; // aca puedes cambiar currency
            // crear orden
            const { order: orderStore } = await this.ordersApiService.store(
                body,
                req,
                "izipay",
                1,
                {
                    pasarela_comision: empresa.enabledClientPayComision,
                }
            );
            const amount = empresa.enabledClientPayComision
                ? orderStore.total +
                  pasarelaComision(empresa, orderStore.total, "izipay")
                : orderStore.total;

            const auth = btoa(
                `${metodosPago.izipay.izipay_client_id}:${metodosPago.izipay.izipay_client_secret}`
            );

            const customer = body.email ? { email: body.email } : {};
            const response = await fetch(
                "https://api.micuentaweb.pe/api-payment/V4/Charge/CreatePayment",
                {
                    method: "POST",
                    body: JSON.stringify({
                        amount: Number.parseInt(amount.toFixed(2)) * 100, // izipay necesita 00
                        currency: currency,
                        orderId: orderStore.order_code,
                        ...customer,
                    }), //LAS CREDENCIALES A DOLARES
                    headers: {
                        Authorization: `Basic ${auth}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            const resultIzipay = await response.json();
            if (resultIzipay.status !== "SUCCESS")
                throw new BadRequestException(resultIzipay.answer.errorMessage);
            const token = resultIzipay.answer.formToken;
            return {
                success: true,
                token,
            };
        } catch (error) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }
    // validar izipay
    async izipayValidate(
        body: KRIzipayResponse,
        empresa: Empresas,
        req: Request
    ) {
        try {
            const clientAnswer = body.clientAnswer;
            if (!clientAnswer) {
                throw new BadRequestException("Invalid response format");
            }
            if (body.hashAlgorithm !== "sha256_hmac") {
                throw new BadRequestException("Invalid hash algorithm");
            }
            const metodosPago = await MetodosPago.findOne({
                where: { empresa_id: empresa.id },
            });
            if (
                !metodosPago?.izipay.izipay_client_id ||
                !metodosPago?.izipay.izipay_client_secret ||
                !metodosPago?.izipay.izipay_hash_key ||
                !metodosPago?.izipay.izipay_public_key
            ) {
                throw new BadRequestException("Error izipay es requerido");
            }
            if (!metodosPago.izipay.enabled) {
                throw new BadRequestException("Error izipay is not available");
            }
            const answer = JSON.parse(body.rawClientAnswer);

            const answerHash = Hex.stringify(
                hmacSHA256(
                    JSON.stringify(answer),
                    metodosPago.izipay.izipay_hash_key
                )
            );

            if (answerHash !== body.hash)
                throw new BadRequestException("Invalid hash");

            const orderCode = clientAnswer.orderDetails.orderId;
            const { order } = await this.ordersApiService.show(
                empresa,
                orderCode
            );

            // Validar el estado del pedido
            if (clientAnswer.orderStatus !== "PAID") {
                const message = "Hubo un error al pagar";
                await this.onError(order, message);
                await this.ordersApiService.update({
                    order_code: order.order_code,
                    ordersUpdateDto: {
                        ...order.toJSON(),
                        pasarela_response: body as object,
                        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                    } as any,
                    req,
                });
                throw new BadRequestException(message);
            }
            await this.ordersApiService.update({
                order_code: order.order_code,
                ordersUpdateDto: {
                    ...order.toJSON(),
                    description: "Se realizó el pago.",
                    status_order_id: STATUSORDER.pagado,
                    note: null,
                    send_message: order.telephone, // enviar mensaje a whatsapp
                    invoice: {
                        ...order.dataValues.invoice.toJSON(),
                        sendMessage: order.telephone,
                        send_sunat: empresa.enabledSendSunat, // enviar a sunat
                    },
                    pasarela_response: body,
                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                } as any,
                req,
            });
            return {
                success: true,
                order,
            };
        } catch (error) {
            throw new InternalServerErrorException("Error de server");
        }
    }

    async onError(orderStore: Orders, message: string) {
        if (orderStore.status_order_id !== STATUSORDER.pagado) {
            //  hubo un problema
            await Promise.all([
                orderStore.update({
                    status_order_id: STATUSORDER.problema,
                    description: message,
                }),
            ]);
        }

        throw new BadRequestException(message);
    }
}
