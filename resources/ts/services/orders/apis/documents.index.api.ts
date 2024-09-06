import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import type { DocumentsSchema } from "../schemas/documents.schema";

export type DocumentsIndexApiMethod = UseQuery<DocumentsIndexAPI, unknown>;
export function documentsIndexApi(): DocumentsIndexApiMethod {
	return useQuery<DocumentsIndexAPI, unknown>("/documents", async (url) => {
		const response = await fetch(`/api${url}`);
		const result = await response.json();
		if (!result.success) throw result;
		return result;
	});
}

export interface DocumentsIndexAPI {
	success: boolean;
	data: DocumentsSchema[];
}
