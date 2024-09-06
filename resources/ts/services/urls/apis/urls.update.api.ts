import { useMutation } from "@vigilio/preact-fetching";
import type { UrlsUpdateDto } from "../dtos/urls.update.dto";
import type { UrlsSchemaFromServer } from "../schemas/urls.schema";

export function urlsUpdateApi(hash: string) {
	return useMutation<UrlsUpdateAPI, UrlsUpdateDto, UrlsUpdateErrorAPI>(
		`/urls/${hash}`,
		async (url, body: UrlsUpdateDto) => {
			const response = await fetch(`/api${url}`, {
				method: "PUT",
				body: JSON.stringify(body),
				headers: {
					"content-type": "application/json",
				},
			});
			const result: UrlsUpdateAPI = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}

export interface UrlsUpdateAPI {
	success: boolean;
	url: UrlsSchemaFromServer;
}

export interface UrlsUpdateErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
