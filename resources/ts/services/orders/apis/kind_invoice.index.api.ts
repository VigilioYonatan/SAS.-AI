import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import type { KindInvoiceSchema } from "../schemas/kind_invoice.schema";

export type KindInvoiceIndexApiMethod = UseQuery<KindInvoiceIndexAPI, unknown>;

export function kindInvoiceIndexApi(): KindInvoiceIndexApiMethod {
    return useQuery<KindInvoiceIndexAPI, unknown>(
        "/kind_invoice",
        async (url) => {
            const response = await fetch(`/api${url}`);
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        }
    );
}

export interface KindInvoiceIndexAPI {
    success: boolean;
    data: KindInvoiceSchema[];
}
