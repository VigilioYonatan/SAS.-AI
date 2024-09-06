import type { UrlsSchemaFromServer } from "../schemas/urls.schema";
import type { UrlsStoreDto } from "../dtos/urls.store.dto";
import { useMutation } from "@vigilio/preact-fetching";

export function urlsStoreApi() {
	return useMutation<UrlsStoreAPI, UrlsStoreDto, UrlsStoreErrorAPI>(
		"/urls",
		async (url, body) => {
			const response = await fetch(`/api${url}`, {
				body: JSON.stringify(body),
				method: "POST",
				headers: {
					"content-type": "application/json",
				},
			});
			const result: UrlsStoreAPI = await response.json();

			if (!result.success) throw result;
			return result;
		},
	);
}

export interface UrlsStoreAPI {
	success: boolean;
	url: UrlsSchemaFromServer;
}

export interface UrlsStoreErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
