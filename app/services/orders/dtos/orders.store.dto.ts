import {
	type Input,
	mergeAsync,
	omitAsync,
	nullableAsync,
	objectAsync,
	arrayAsync,
	string,
	nullable,
	minLength,
	maxLength,
	toTrimmed,
	custom,
	object,
} from "@vigilio/valibot";
import { ordersSchema } from "../schemas/orders.schema";
import { detailOrdersStoreDto } from "./detail_orders.store.dto";
import { invoicesStoreDto } from "./invoices.store.dto";

export const ordersStoreDto = mergeAsync([
	omitAsync(ordersSchema, [
		"id",
		"order_code",
		"igv",
		"pasarela_comision",
		"pasarela_response",
		"paypal_response",
		"paypal_token",
		"moneyChange",
		"is_pasarela_client",
		"empresa_id",
		"type_pasarela",
		"mercado_pago_token",
		"stripe_token",
	]),
	objectAsync({
		invoice: nullableAsync(
			omitAsync(invoicesStoreDto, [
				"cdr_path",
				"serie",
				"xml_path",
				"order_id",
				"correlativo",
				"response_sunat",
				"empresa_id",
			]),
		),
		details_orders: arrayAsync(omitAsync(detailOrdersStoreDto, ["order_id"])),
		fullName: nullable(string([minLength(3), maxLength(30)])),
	}),
	object({
		password: nullable(
			string([
				toTrimmed(),
				minLength(1),
				minLength(6),
				maxLength(30),
				custom(
					(val) => /[a-zA-Z]/.test(val),
					"Deber tener por lo menos una letra.",
				),
				custom((val) => /\d/.test(val), "Deber tener por lo menos un número."),
			]),
		),
		repeat_password: nullable(
			string([
				toTrimmed(),
				minLength(1),
				minLength(6),
				maxLength(30),
				custom(
					(val) => /[a-zA-Z]/.test(val),
					"Deber tener por lo menos una letra.",
				),
				custom((val) => /\d/.test(val), "Deber tener por lo menos un número."),
			]),
		),
	}),
]);
export type OrdersStoreDto = Input<typeof ordersStoreDto>;
