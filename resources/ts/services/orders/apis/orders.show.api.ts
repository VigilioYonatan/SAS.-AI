import enviroments from "~/config";
import { useMutation, type UseQuery, useQuery } from "@vigilio/preact-fetching";
import type { OrdersSchemaFromServer } from "../schemas/orders.schema";

export function ordersShowApi(
	order_code: string,
): UseQuery<OrdersShowAPI, OrdersShowErrorAPI> {
	return useQuery<OrdersShowAPI, OrdersShowErrorAPI>(
		`/orders/${order_code}`,
		async (url) => {
			const response = await fetch(`${enviroments.VITE_URL}/api${url}`);
			const result = await response.json();
			if (!result.success) throw result;

			return result;
		},
	);
}

export function ordersShow2Api() {
	return useMutation<OrdersShowAPI, string, OrdersShowErrorAPI>(
		"/orders",
		async (url, order_code) => {
			const response = await fetch(
				`${enviroments.VITE_URL}/api${url}/${order_code}`,
			);
			const result = await response.json();
			if (!result.success) throw result;

			return result;
		},
	);
}

export interface OrdersShowAPI {
	success: boolean;
	order: OrdersSchemaFromServer;
}

export interface OrdersShowErrorAPI {
	success: boolean;
	message: string;
}
