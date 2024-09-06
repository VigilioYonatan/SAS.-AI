import { useMutation } from "@vigilio/preact-fetching";
import type { OrdersUpdateDto } from "../dtos/orders.update.dto";
import type { OrdersSchemaFromServer } from "../schemas/orders.schema";

export function ordersUpdateApi(order_code: string) {
	return useMutation<OrdersUpdateAPI, OrdersUpdateDto, OrdersUpdateErrorAPI>(
		`/orders/${order_code}`,
		async (url, body) => {
			const response = await fetch(`/api${url}`, {
				method: "PUT",
				body: JSON.stringify(body),
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

export interface OrdersUpdateAPI {
	success: boolean;
	order: OrdersSchemaFromServer;
}
export interface OrdersUpdateErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
