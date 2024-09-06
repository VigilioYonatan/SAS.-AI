import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import type { UrlsSchemaFromServer } from "../schemas/urls.schema";

export type UrlsIndexApiMethod = UseQuery<UrlsIndexAPI, unknown>;

export function urlsIndexApi(): UrlsIndexApiMethod {
	return useQuery("/urls", async (url) => {
		const response = await fetch(`/api${url}`);
		const result: UrlsIndexAPI = await response.json();
		if (!result.success) throw result;
		return result;
	});
}

export interface UrlsIndexAPI {
	success: boolean;
	data: UrlsSchemaFromServer[];
}
