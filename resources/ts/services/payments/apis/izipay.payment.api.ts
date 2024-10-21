import { useMutation } from "@vigilio/preact-fetching";
import type { OrdersStoreDto } from "@/orders/dtos/orders.store.dto";

export function izipayPaymentApi() {
	return useMutation<IzipayAPI, OrdersStoreDto, IzipayErrorAPI>(
		"/izipay/order",
		async (url, body) => {
			const response = await fetch(`/api${url}`, {
				body: JSON.stringify(body),
				method: "POST",
				headers: {
					"content-type": "application/json",
				},
			});
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}

export interface IzipayAPI {
	success: boolean;
	token: string;
}

export interface IzipayErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
import type { OrdersSchema } from "@/orders/schemas/orders.schema";

export function izipayPaymentValidateApi() {
	return useMutation<IzipayAPI, KRPaymentResponse, IzipayErrorAPI>(
		"/izipay/validate",
		async (url, body) => {
			const response = await fetch(`/api${url}`, {
				body: JSON.stringify(body),
				method: "POST",
				headers: {
					"content-type": "application/json",
				},
			});
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}

export interface IzipayAPI {
	success: boolean;
	order: OrdersSchema;
}

export interface IzipayErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
