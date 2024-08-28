import { useMutation, type UseMutation } from "@vigilio/preact-fetching";

export type GuidesLatestCorrelativoMutation = UseMutation<
    GuidesLatestCorrelativoAPI,
    string,
    unknown
>;
export function guidesLatestCorrelativoApi(): GuidesLatestCorrelativoMutation {
    return useMutation(
        "/guides/latest_correlativo",
        async (url, kind_invoice_code: string) => {
            const response = await fetch(`/api${url}/${kind_invoice_code}`);
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        }
    );
}

export interface GuidesLatestCorrelativoAPI {
    success: boolean;
    correlativo: string;
}
