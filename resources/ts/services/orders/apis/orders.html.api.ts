import { storageInformation } from "@/information/stores/information.store";
import { type UseQuery, useQuery } from "@vigilio/preact-fetching";

export function ordersHTMLApi(
	order_code: string,
	type:
		| "invoice"
		| "note"
		| "guide"
		| "recibo" = storageInformation?.dial_code === "51" ? "invoice" : "recibo",
): UseQuery<string, OrdersHTMLErrorAPI> {
	return useQuery<string, OrdersHTMLErrorAPI>(
		`/orders/${order_code}/html?type=${type}`,
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
