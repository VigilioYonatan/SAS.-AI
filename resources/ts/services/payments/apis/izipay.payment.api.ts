import enviroments from "~/config";
import { useMutation } from "@vigilio/preact-fetching";
import type { OrdersCartStoreDto } from "@/orders/dtos/orders-cart.dto";

export function izipayPaymentApi() {
	return useMutation<IzipayAPI, OrdersCartStoreDto, IzipayErrorAPI>(
		"/payment/izipay/order",
		async (url, body) => {
			const response = await fetch(`${enviroments.VITE_URL}/api${url}`, {
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
