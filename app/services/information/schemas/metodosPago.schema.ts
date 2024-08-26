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

export const metodosPagoSchema = object({
    enable_efectivo: boolean(), // el cliente venderá por efectivo tambien? osea el cliente podrá pagar cuando recibe el producto
    enable_paypal: boolean(), // el cliente venderá por efectivo tambien? osea el cliente podrá pagar cuando recibe el producto
    qrYape: nullable(array(filesSchema([500]))),
    qrPlin: nullable(array(filesSchema([500]))),
    information_id: number(),
    mercado_pago: nullable(string([maxLength(200)])),
});

export type MetodosPagoSchema = Input<typeof metodosPagoSchema>;
