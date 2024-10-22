import {
	type Input,
	array,
	merge,
	nullable,
	omit,
	object,
	instance,
	number,
	string,
	maxLength,
	minLength,
} from "@vigilio/valibot";
import { ordersSchema } from "../schemas/orders.schema";
import { invoicesStoreDto } from "./invoices.store.dto";
import { detailOrdersSchema } from "../schemas/detail_orders.schema";
import validFileValibot from "~/libs/valibot";

export const ordersStoreDto = merge([
	omit(ordersSchema, [
		"id",
		"order_code",
		"igv",
		"pasarela_comision",
		"pasarela_response",
		"paypal_token",
		"paypal_response",
		"moneyChange",
		"transferencia_image",
		"is_pasarela_client",
		"client_id",
		"empresa_id",
		"mercado_pago_token",
		"type_pasarela",
		"stripe_token",
	]),
	object({
		invoice: nullable(
			omit(invoicesStoreDto, [
				"cdr_path",
				"serie",
				"xml_path",
				"order_id",
				"correlativo",
				"response_sunat",
			]),
		),
		details_orders: array(
			omit(detailOrdersSchema, ["id", "order_id", "empresa_id"]),
		),
		transferencia_image: nullable(
			array(instance(File), [
				validFileValibot({
					required: false,
					min: 1,
					max: 1,
				}),
			]),
		),
		fullName: nullable(string([minLength(3), maxLength(30)])),
		floor_id: nullable(number()),
	}),
]);
export type OrdersStoreDto = Input<typeof ordersStoreDto>;
