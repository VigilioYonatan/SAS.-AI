import enviroments from "~/config";
import { useMutation } from "@vigilio/preact-fetching";
import type { CreditCardSchema } from "../schemas/credit-card.schema";
import type { OrdersCartStoreDto } from "@/orders/dtos/orders-cart.dto";
import type { YapeSchema } from "../schemas/yape.schema";
import type { OrdersSchema } from "@/orders/schemas/orders.schema";

export function niubizPaymentApi() {
	return useMutation<
		NiubizAPI,
		Omit<OrdersCartStoreDto, "reference"> & {
			creditCard: null | CreditCardSchema;
			yape: null | YapeSchema;
		},
		NiubizErrorAPI
	>("/payment/niubiz", async (url, body) => {
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
	});
}

export interface NiubizAPI {
	success: boolean;
	order: OrdersSchema;
}

export interface NiubizErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
