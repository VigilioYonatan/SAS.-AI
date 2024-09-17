import { type UseQuery, useQuery } from "@vigilio/preact-fetching";

export function ordersHTMLApi(
	order_code: string,
): UseQuery<string, OrdersHTMLErrorAPI> {
	return useQuery<string, OrdersHTMLErrorAPI>(
		`/orders/${order_code}/ticket`,
		async (url) => {
			const response = await fetch(`/api${url}`);
			const result = await response.text();
			return result;
		},
	);
}

export interface OrdersHTMLErrorAPI {
	success: boolean;
	message: string;
}
