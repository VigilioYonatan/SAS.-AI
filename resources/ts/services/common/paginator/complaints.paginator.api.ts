import { useQuery } from "@vigilio/preact-fetching";
import type { UseTable } from "@vigilio/preact-table";
import type { ComplaintsIndexSecondaryPaginator } from "@/empresas/libs/complaintsColumns";
import type { ComplaintsSchemaFromServer } from "@/empresas/schemas/complaints.schema";

export function complaintsPaginatorApi(
    table: UseTable<
        ComplaintsSchemaFromServer,
        ComplaintsIndexSecondaryPaginator
    >
) {
    const result = useQuery<
        ComplaintsPaginatorAPI,
        ComplaintsPaginatorAPIError
    >(
        "/paginator/complaints",
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
                    methods: { refetch: result.refetch },
                });
            },
        }
    );
    return result;
}
interface ComplaintsPaginatorAPI {
    success: true;
    results: ComplaintsSchemaFromServer[];
    count: number;
    next: string | null;
    previous: string | null;
}
interface ComplaintsPaginatorAPIError {
    success: false;
    message: string;
    params: string;
}
