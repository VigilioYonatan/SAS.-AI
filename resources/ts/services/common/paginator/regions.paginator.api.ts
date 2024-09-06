import { useQuery } from "@vigilio/preact-fetching";
import type { UseTable } from "@vigilio/preact-table";
import type { RegionsSchemaFromServer } from "@/ubigeo/schemas/regions.schema";
import type { RegionsIndexSecondaryPaginator } from "@/ubigeo/libs/RegionsColumns";

export function regionsPaginatorApi(
	table: UseTable<RegionsSchemaFromServer, RegionsIndexSecondaryPaginator>,
) {
	const result = useQuery<RegionsPaginatorAPI, RegionsPaginatorAPIError>(
		"/paginator/regions",
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
interface RegionsPaginatorAPI {
	success: true;
	results: RegionsSchemaFromServer[];
	count: number;
	next: string | null;
	previous: string | null;
}
interface RegionsPaginatorAPIError {
	success: false;
	message: string;
	params: string;
}
