import { useQuery } from "@vigilio/preact-fetching";
import enviroments from "~/config";
import type { UseTable } from "@vigilio/preact-table";
import type { ContactsSchema } from "@/information/schemas/information.schema";
import type { ContactsIndexSecondaryPaginator } from "@/bot/libs/ContactsColumns";

export function informationContactsPaginatorApi(
    table: UseTable<ContactsSchema, ContactsIndexSecondaryPaginator>
) {
    const result = useQuery<
        InformationContactsPaginatorAPI,
        InformationContactsPaginatorAPIError
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

interface InformationContactsPaginatorAPI {
    success: true;
    results: ContactsSchema[];
    count: number;
    next: string | null;
    previous: string | null;
}
interface InformationContactsPaginatorAPIError {
    success: false;
    message: string;
    params: string;
}
