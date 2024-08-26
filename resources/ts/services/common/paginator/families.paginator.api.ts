import { useQuery } from "@vigilio/preact-fetching";
import enviroments from "~/config";
import type { FamiliesSchemaFromServer } from "@/products/schemas/families.schema";
import type { UseTable } from "@vigilio/preact-table";

export function familiesPaginatorApi(
	table: UseTable<
		FamiliesSchemaFromServer,
		"acciones",
		{ refetch: () => void }
	>,
) {
	const result = useQuery<FamiliesPaginatorAPI, FamiliesPaginatorAPIError>(
		"/paginator/families",
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
					methods: { refetch: result.refetch },
				});
			},
		},
	);
	return result;
}
interface FamiliesPaginatorAPI {
	success: true;
	results: FamiliesSchemaFromServer[];
	count: number;
	next: string | null;
	previous: string | null;
}
interface FamiliesPaginatorAPIError {
	success: false;
	message: string;
	params: string;
}
