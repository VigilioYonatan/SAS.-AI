import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import type { KindCreditNotesSchema } from "../schemas/kind_credit_notes.schema";

export type KindCreditNotesIndexApiMethod = UseQuery<
    KindCreditNotesIndexAPI,
    unknown
>;
export function kindCreditNotesIndexApi(): KindCreditNotesIndexApiMethod {
    return useQuery<KindCreditNotesIndexAPI, unknown>(
        "/kind_credit_notes",
        async (url) => {
            const response = await fetch(`/api${url}`);
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        }
    );
}

export interface KindCreditNotesIndexAPI {
    success: boolean;
    data: KindCreditNotesSchema[];
}
