import { useQuery } from "@vigilio/preact-fetching";
import type { EmailsSchemaFromServer } from "@/emails/schemas/emails.schema";
import type { UseTable } from "@vigilio/preact-table";
import type { EmailsIndexSecondaryPaginator } from "@/emails/libs/EmailsColumns";

export function emailsPaginatorApi(
    table: UseTable<EmailsSchemaFromServer, EmailsIndexSecondaryPaginator>
) {
    const result = useQuery<EmailsPaginatorAPI, EmailsPaginatorAPIError>(
        "/paginator/emails",
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
                });
            },
        }
    );
    return result;
}
interface EmailsPaginatorAPI {
    success: true;
    results: EmailsSchemaFromServer[];
    count: number;
    next: string | null;
    previous: string | null;
}
interface EmailsPaginatorAPIError {
    success: false;
    message: string;
    params: string;
}
