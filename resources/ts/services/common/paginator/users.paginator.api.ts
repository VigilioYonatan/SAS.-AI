import { useQuery } from "@vigilio/preact-fetching";
import type { UsersSchemaFromServer } from "@/users/schemas/users.schema";
import type { UseTable } from "@vigilio/preact-table";
import type { UsersIndexSecondaryPaginator } from "@/users/libs/UsersColumns";

export function usersPaginatorApi(
	table: UseTable<UsersSchemaFromServer, UsersIndexSecondaryPaginator>,
	role_id: number | null = null,
) {
	const result = useQuery<UsersPaginatorAPI, UsersPaginatorAPIError>(
		"/paginator/users",
		async (url) => {
			const data = new URLSearchParams();
			data.append("offset", String(table.pagination.value.offset));
			data.append("limit", String(table.pagination.value.limit));
			data.append("search", String(table.search.value));
			if (role_id) {
				data.append("role_id", String(role_id));
			}
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
				});
			},
		},
	);
	return result;
}
interface UsersPaginatorAPI {
	success: true;
	results: UsersSchemaFromServer[];
	count: number;
	next: string | null;
	previous: string | null;
}
interface UsersPaginatorAPIError {
	success: false;
	message: string;
	params: string;
}
