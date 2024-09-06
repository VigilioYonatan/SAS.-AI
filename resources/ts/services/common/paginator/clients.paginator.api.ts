import { useQuery } from "@vigilio/preact-fetching";
import type { UseTable } from "@vigilio/preact-table";
import { ClientsSchemaFromServer } from "@/users/schemas/client.schema";
import { ClientsIndexSecondaryPaginator } from "@/users/libs/ClientsColumns";

export function clientsPaginatorApi(
	table: UseTable<
		ClientsSchemaFromServer,
		ClientsIndexSecondaryPaginator,
		{ refetch: (clean?: boolean) => void }
	>,
) {
	const result = useQuery<ClientsPaginatorAPI, ClientsPaginatorAPIError>(
		"/paginator/clients",
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
export interface ClientsPaginatorAPI {
	success: true;
	results: ClientsSchemaFromServer[];
	count: number;
	next: string | null;
	previous: string | null;
}
export interface ClientsPaginatorAPIError {
	success: false;
	message: string;
	params: string;
}
