import { type UseQuery, useQuery } from "@vigilio/preact-fetching";

export function ordersPDFApi(
    order_code: string,
    type: "invoice" | "note" | "guide" = "invoice"
): UseQuery<Blob, OrdersPDFErrorAPI> {
    return useQuery<Blob, OrdersPDFErrorAPI>(
        `/orders/${order_code}/pdf?type=${type}`,
        async (url) => {
            const response = await fetch(`/api${url}`);
            const result = await response.blob();
            return result;
        }
    );
}

export interface OrdersPDFErrorAPI {
    success: boolean;
    message: string;
}
