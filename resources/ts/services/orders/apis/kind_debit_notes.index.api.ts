import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import type { KindDebitNotesSchema } from "../schemas/kind_debit_notes.schema";

export type KindDebitNotesIndexApiMethod = UseQuery<
	KindDebitNotesIndexAPI,
	unknown
>;
export function kindDebitNotesIndexApi(): KindDebitNotesIndexApiMethod {
	return useQuery<KindDebitNotesIndexAPI, unknown>(
		"/kind_debit_notes",
		async (url) => {
			const response = await fetch(`/api${url}`);
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}

export interface KindDebitNotesIndexAPI {
	success: boolean;
	data: KindDebitNotesSchema[];
}
