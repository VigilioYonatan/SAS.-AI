import { useMutation } from "@vigilio/preact-fetching";

export function notesLatestCorrelativoApi() {
    return useMutation<NotesLatestCorrelativoAPI, string, unknown>(
        "/notes/latest_correlativo",
        async (url, kind_invoice_code: string) => {
            const response = await fetch(`/api${url}/${kind_invoice_code}`);
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        }
    );
}

export interface NotesLatestCorrelativoAPI {
    success: boolean;
    correlativo: string;
}
