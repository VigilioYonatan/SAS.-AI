import {
	array,
	boolean,
	maxLength,
	nullable,
	number,
	object,
	record,
	string,
	type Input,
} from "@vigilio/valibot";
import { filesSchema } from "~/libs/upload";

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
	qrYape: nullable(array(filesSchema())),
	qrPlin: nullable(array(filesSchema())),
	transferencias: nullable(
		record(string(), nullable(record(string(), nullable(string())))),
	),
	empresa_id: number(),
});

export type MetodosPagoSchema = Input<typeof metodosPagoSchema>;
