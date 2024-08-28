import { filesSchema } from "@/uploads/schemas/uploads.schema";
import {
    array,
    boolean,
    maxLength,
    nullable,
    number,
    object,
    string,
    type Input,
} from "@vigilio/valibot";
export const transferenciaSchema = object({
    // bcp: nullable(
    //     object({
    //         titular: nullable(string()),
    //         soles: nullable(string()),
    //         dolares: nullable(string()),
    //     })
    // ),
});

export type TransferenciaSchema = Input<typeof transferenciaSchema>;
export const metodosPagoSchema = object({
    enable_efectivo: boolean(), // el cliente venderá por efectivo tambien? osea el cliente podrá pagar cuando recibe el producto
    paypal: object({
        enabled: boolean(),
        paypal_client_id: nullable(string()),
        paypal_secret_key: nullable(string()),
    }), // el cliente venderá por efectivo tambien? osea el cliente podrá pagar cuando recibe el producto
    mercado_pago: object({
        token: nullable(string([maxLength(200)])),
        enabled: boolean(),
    }),
    qrYape: nullable(array(filesSchema([500]))),
    qrPlin: nullable(array(filesSchema([500]))),
    transferencias: nullable(transferenciaSchema), // array de numero de transferencia si el cliente quiero poner como metodo de pago
    information_id: number(),
});

export type MetodosPagoSchema = Input<typeof metodosPagoSchema>;
