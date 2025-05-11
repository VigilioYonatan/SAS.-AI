import { UsersFormIndexSecondaryPaginator } from "@/users/libs/UsersFormColumn";
import { UsersFormSchema } from "@/users/schemas/users-form.schema";
import { useQuery } from "@vigilio/preact-fetching";
import type { UseTable } from "@vigilio/preact-table";

export function usersFormPaginatorApi(
    table: UseTable<
        UsersFormSchema & { createdAt: Date },
        UsersFormIndexSecondaryPaginator
    >
) {
    const result = useQuery<UsersFormPaginatorAPI, UsersFormPaginatorAPIError>(
        "/paginator/users-form",
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
                });
            },
        }
    );
    return result;
}
interface UsersFormPaginatorAPI {
    success: true;
    results: (UsersFormSchema & { createdAt: Date })[];
    count: number;
    next: string | null;
    previous: string | null;
}
interface UsersFormPaginatorAPIError {
    success: false;
    message: string;
    params: string;
}
