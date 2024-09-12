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
		"client_id",
		"mercado_pago_token",
	]),
	objectAsync({
		invoice: nullableAsync(
			omitAsync(invoicesStoreDto, [
				"cdr_path",
				"serie",
				"xml_path",
				"order_id",
				"correlativo",
				"empresa_id",
				"response_sunat",
				"empresa_id",
			]),
		),
		details_orders: arrayAsync(omitAsync(detailOrdersStoreDto, ["order_id"])),
		fullName: nullable(string([minLength(3), maxLength(30)])),
	}),
]);
export type OrdersStoreDto = Input<typeof ordersStoreDto>;
