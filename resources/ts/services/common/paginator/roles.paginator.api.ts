import { useQuery } from "@vigilio/preact-fetching";
import enviroments from "~/config";
import type { RolesSchemaFromServer } from "@/roles/schemas/roles.schema";
import type { UseTable } from "@vigilio/preact-table";
import type { RolesIndexSecondaryPaginator } from "@/roles/libs/RolesColumns";

export function rolesPaginatorApi(
	table: UseTable<RolesSchemaFromServer, RolesIndexSecondaryPaginator>,
) {
	const result = useQuery<RolesPaginatorAPI, RolesPaginatorAPIError>(
		"/paginator/roles",
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
				});
			},
		},
	);
	return result;
}
interface RolesPaginatorAPI {
	success: true;
	results: RolesSchemaFromServer[];
	count: number;
	next: string | null;
	previous: string | null;
}
interface RolesPaginatorAPIError {
	success: false;
	message: string;
	params: string;
}
