import type { OrdersStoreDto } from "@/orders/dtos/orders.store.dto";
import { useMutation } from "@vigilio/preact-fetching";
import enviroments from "~/config";

export function paypalPaymentApi() {
	return useMutation<PaypalAPI, OrdersStoreDto, PaypalErrorAPI>(
		`${enviroments.VITE_URL}/paypal/api/order`,
		async (url, body) => {
			const response = await fetch(url, {
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

export interface PaypalAPI {
	success: boolean;
	result: {
		id: string;
		links: { href: string; method: string; rel: string }[];
		status: "CREATED";
	};
}

export interface PaypalErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
