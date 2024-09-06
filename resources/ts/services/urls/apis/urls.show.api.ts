import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import type { UrlsSchemaFromServer } from "../schemas/urls.schema";

export function urlsShowApi(
	hash: number,
): UseQuery<UrlsShowAPI, UrlsShowErrorAPI> {
	return useQuery(`/urls/${hash}`, async (url) => {
		const response = await fetch(`/api${url}`);
		const result: UrlsShowAPI = await response.json();
		if (!result.success) throw result;
		return result;
	});
}

export interface UrlsShowAPI {
	success: boolean;
	url: UrlsSchemaFromServer;
}

export interface UrlsShowErrorAPI {
	success: boolean;
	message: string;
}
