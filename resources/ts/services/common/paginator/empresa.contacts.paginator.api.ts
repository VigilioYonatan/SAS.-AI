import { useQuery } from "@vigilio/preact-fetching";
import type { UseTable } from "@vigilio/preact-table";
import type { ContactsSchema } from "@/empresas/schemas/empresas.schema";
import type { ContactsIndexSecondaryPaginator } from "@/bot/libs/ContactsColumns";

export function empresaContactsPaginatorApi(
    table: UseTable<ContactsSchema, ContactsIndexSecondaryPaginator>
) {
    const result = useQuery<
        empresaContactsPaginatorAPI,
        empresaContactsPaginatorAPIError
    >(
        "/paginator/contacts",

        async (url) => {
            const data = new URLSearchParams();
            data.append("offset", String(table.pagination.value.offset));
            data.append("limit", String(table.pagination.value.limit));
            data.append("search", String(table.search.value));
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

interface empresaContactsPaginatorAPI {
    success: true;
    results: ContactsSchema[];
    count: number;
    next: string | null;
    previous: string | null;
}
interface empresaContactsPaginatorAPIError {
    success: false;
    message: string;
    params: string;
}
