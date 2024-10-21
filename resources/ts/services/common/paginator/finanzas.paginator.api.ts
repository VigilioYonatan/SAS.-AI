import { FinanzasIndexSecondaryPaginator } from "@/finanzas/libs/FinanzasColumns";
import { FinanzasSchemaFromServer } from "@/finanzas/schemas/finanzas.schema";
import { useQuery } from "@vigilio/preact-fetching";
import type { UseTable } from "@vigilio/preact-table";

export function finanzasPaginatorApi(
	table: UseTable<
		FinanzasSchemaFromServer,
		FinanzasIndexSecondaryPaginator,
		{ refetch: (clean?: boolean) => void }
	>,
	time: string,
) {
	const result = useQuery<FinanzasPaginatorAPI, FinanzasPaginatorAPIError>(
		"/paginator/finanzas",
		async (url) => {
			const data = new URLSearchParams();
			data.append("offset", String(table.pagination.value.offset));
			data.append("limit", String(table.pagination.value.limit));
			data.append("time", time);

			if (!Object.keys(table.sort.value).length) {
				data.append("id", "DESC");
			}
			for (const [key, value] of Object.entries(table.sort.value)) {
				data.append(key, value as string);
			}
			const response = await fetch(`/api${url}?${data}`);
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
		{
			onSuccess(data) {
				table.updateData({
					count: data.count,
					result: data.results,
					methods: {
						refetch: result.refetch,
					},
				});
			},
		},
	);
	return result;
}
interface FinanzasPaginatorAPI {
	success: true;
	results: FinanzasSchemaFromServer[];
	count: number;
	next: string | null;
	previous: string | null;
}
interface FinanzasPaginatorAPIError {
	success: false;
	message: string;
	params: string;
}
