import { CrudSchema } from "@/empresas/schemas/crud.schema";
import { useQuery } from "@vigilio/preact-fetching";
import type { UseTable } from "@vigilio/preact-table";

export function crudPaginatorApi(
    table: UseTable<CrudSchema, string, { refetch: (clean?: boolean) => void }>,
    slug: string
) {
    const result = useQuery<CrudPaginatorAPI, CrudPaginatorAPIError>(
        `/paginator/${slug}`,
        async (url) => {
            const data = new URLSearchParams();
            data.append("offset", String(table.pagination.value.offset));
            data.append("limit", String(table.pagination.value.limit));
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
        }
    );
    return result;
}
interface CrudPaginatorAPI {
    success: true;
    results: CrudSchema[];
    count: number;
    next: string | null;
    previous: string | null;
}
interface CrudPaginatorAPIError {
    success: false;
    message: string;
    params: string;
}
