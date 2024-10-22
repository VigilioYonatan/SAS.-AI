import {
	type Input,
	boolean,
	merge,
	omit,
	object,
	nullable,
} from "@vigilio/valibot";
import { ordersSchema } from "../schemas/orders.schema";
import { invoicesStoreDto } from "./invoices.store.dto";
import { notesStoreDto } from "./notes.store.dto";
import { guidesStoreDto } from "./guides.store.dto";

export const ordersUpdateDto = merge([
	omit(ordersSchema, [
		"id",
		"order_code",
		"user_id",
		"igv",
		"pasarela_comision",
		"paypal_token",
		"pasarela_response",
		"paypal_response",
		"moneyChange",
		"is_pasarela_client",
		"map_marker",
		"mercado_pago_token",
		"empresa_id",
		"client_id",
		"type_pasarela",
		"stripe_token",
	]),
	object({
		invoice: nullable(
			omit(invoicesStoreDto, [
				"cdr_path",
				"xml_path",
				"order_id",
				"response_sunat",
			]),
		),
		note: nullable(
			omit(notesStoreDto, [
				"cdr_path",
				"xml_path",
				"invoice_id",
				"order_id",
				"response_sunat",
			]),
		),
		guide: nullable(
			omit(guidesStoreDto, [
				"cdr_path",
				"xml_path",
				"order_id",
				"response_sunat",
			]),
		),
		send_message: boolean(),
	}),
]);
export type OrdersUpdateDto = Input<typeof ordersUpdateDto>;
