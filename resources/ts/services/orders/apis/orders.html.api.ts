import enviroments from "~/config";
import { type UseQuery, useQuery } from "@vigilio/preact-fetching";

export function ordersHTMLApi(
	order_code: string,
	type: "invoice" | "note" | "guide" = "invoice",
): UseQuery<string, OrdersHTMLErrorAPI> {
	return useQuery<string, OrdersHTMLErrorAPI>(
		`/orders/${order_code}/html?type=${type}`,
		async (url) => {
			const response = await fetch(`${enviroments.VITE_URL}/api${url}`);
			const result = await response.text();
			return result;
		},
	);
}

export interface OrdersHTMLErrorAPI {
	success: boolean;
	message: string;
}
