import enviroments from "~/config";
import { useMutation } from "@vigilio/preact-fetching";
import type { OrdersSchema } from "@/orders/schemas/orders.schema";

export function izipayPaymentValidateApi() {
	return useMutation<IzipayAPI, KRPaymentResponse, IzipayErrorAPI>(
		"/payment/izipay/validate",
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
	order: OrdersSchema;
}

export interface IzipayErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
