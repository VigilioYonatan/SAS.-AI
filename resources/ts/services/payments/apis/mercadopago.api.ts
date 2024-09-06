import type { OrdersStoreDto } from "@/orders/dtos/orders.store.dto";
import { useMutation } from "@vigilio/preact-fetching";

export function mercadoPagoPaymentApi() {
	return useMutation<MercadoPagoAPI, OrdersStoreDto, MercadoPagoErrorAPI>(
		"payment/api/order",
		async (url, body) => {
			const response = await fetch(`/${url}`, {
				body: JSON.stringify(body),
				method: "POST",
				headers: {
					"content-type": "application/json",
				},
			});
			const result = await response.json();
			if (!response.ok) throw result;
			return result;
		},
	);
}

export interface MercadoPagoAPI {
	success: boolean;
	result: {
		id: string;
		init_point: string;
		status: "CREATED";
	};
}

export interface MercadoPagoErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
