import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import type { OrdersSchemaFromServer } from "../schemas/orders.schema";

export type OrdersIndexApiMethod = UseQuery<OrdersIndexAPI, unknown>;

export function ordersIndexApi(): OrdersIndexApiMethod {
	return useQuery<OrdersIndexAPI, unknown>("/orders", async (url) => {
		const response = await fetch(`/api${url}`);
		const result = await response.json();
		if (!result.success) throw result;
		return result;
	});
}

export interface OrdersIndexAPI {
	success: boolean;
	data: OrdersSchemaFromServer[];
}
