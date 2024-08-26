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
import { filesSchema } from "~/libs/upload";

export const metodosPagoSchema = object({
    enable_efectivo: boolean(), // el cliente venderá por efectivo tambien? osea el cliente podrá pagar cuando recibe el producto
    enable_paypal: boolean(), // el cliente venderá por efectivo tambien? osea el cliente podrá pagar cuando recibe el producto
    qrYape: nullable(array(filesSchema())),
    qrPlin: nullable(array(filesSchema())),
    information_id: number(),
    mercado_pago: nullable(string([maxLength(200)])),
});

export type MetodosPagoSchema = Input<typeof metodosPagoSchema>;
