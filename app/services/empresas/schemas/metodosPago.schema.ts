import { filesSchema } from "@/uploads/schemas/uploads.schema";
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
	transferencias: nullable(
		record(string(), nullable(record(string(), nullable(string())))),
	),
	izipay: nullable(
		object({
			izipay_public_key: nullable(string()),
			izipay_client_id: nullable(string()),
			izipay_client_secret: nullable(string()),
			izipay_hash_key: nullable(string()),
			enabled: boolean(),
		}),
	),
	stripe: nullable(
		object({
			stripe_secret_key: nullable(string()),
			stripe_client_secret: nullable(string()),
			enabled: boolean(),
		}),
	),
	empresa_id: number(),
});

export type MetodosPagoSchema = Input<typeof metodosPagoSchema>;
