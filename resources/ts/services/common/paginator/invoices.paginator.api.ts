import { useQuery } from "@vigilio/preact-fetching";
import enviroments from "~/config";
import type { UseTable } from "@vigilio/preact-table";
import type { TimeTable } from "~/hooks/usePaginatorTimer";
import type { OrdersSchemaFromServer } from "@/orders/schemas/orders.schema";
import type { InvoicesIndexSecondaryPaginator } from "@/facturacion/libs/InvoicesColumns";

export function invoicesPaginatorApi(
	table: UseTable<OrdersSchemaFromServer, InvoicesIndexSecondaryPaginator>,
	typeComprobant: string,
	time: TimeTable,
) {
	const result = useQuery<InvoicesPaginatorAPI, InvoicesPaginatorAPIError>(
		"/paginator/invoices",
		async (url) => {
			const data = new URLSearchParams();
			data.append("offset", String(table.pagination.value.offset));
			data.append("limit", String(table.pagination.value.limit));
			data.append("kind_invoice_code", typeComprobant);
			data.append("time", time);
			if (!Object.keys(table.sort.value).length) {
				data.append("id", "DESC");
			}
			for (const [key, value] of Object.entries(table.sort.value)) {
				data.append(key, value as string);
			}
			const response = await fetch(`${enviroments.VITE_URL}/api${url}?${data}`);
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
		{
			onSuccess(data) {
				table.updateData({
					count: data.count,
					result: data.results,
				});
			},
			refetchIntervalInBackground: true,
			refetchOnReconnect: true,
			clean: false,
		},
	);
	return result;
}

interface InvoicesPaginatorAPI {
	success: true;
	results: OrdersSchemaFromServer[];
	count: number;
	next: string | null;
	previous: string | null;
}
interface InvoicesPaginatorAPIError {
	success: false;
	message: string;
	params: string;
}
