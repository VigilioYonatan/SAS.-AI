import { useQuery } from "@vigilio/preact-fetching";
import type { SuppliersSchemaFromServer } from "@/suppliers/schemas/suppliers.schema";
import type { UseTable } from "@vigilio/preact-table";
import type { SuppliersIndexSecondaryPaginator } from "@/suppliers/libs/SuppliersColumns";

export function suppliersPaginatorApi(
	table: UseTable<
		SuppliersSchemaFromServer,
		SuppliersIndexSecondaryPaginator,
		{ refetch: (clean?: boolean) => void }
	>,
) {
	const result = useQuery<SuppliersPaginatorAPI, SuppliersPaginatorAPIError>(
		"/paginator/suppliers",
		async (url) => {
			const data = new URLSearchParams();
			data.append("offset", String(table.pagination.value.offset));
			data.append("limit", String(table.pagination.value.limit));
			data.append("search", String(table.search.value));
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
interface SuppliersPaginatorAPI {
	success: true;
	results: SuppliersSchemaFromServer[];
	count: number;
	next: string | null;
	previous: string | null;
}
interface SuppliersPaginatorAPIError {
	success: false;
	message: string;
	params: string;
}
