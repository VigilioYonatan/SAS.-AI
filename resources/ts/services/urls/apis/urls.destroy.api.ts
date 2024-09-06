import { useMutation, type UseMutation } from "@vigilio/preact-fetching";

export function urlsDestroyApi(): UseMutation<
	UrlsDestroyAPI,
	string,
	UrlsDestroyErrorAPI
> {
	return useMutation("/urls", async (url, body) => {
		const response = await fetch(`/api${url}/${body}`, {
			method: "DELETE",
		});
		const result: UrlsDestroyAPI = await response.json();
		if (!result.success) throw result;
		return result;
	});
}

export interface UrlsDestroyAPI {
	success: boolean;
	message: string;
}

export interface UrlsDestroyErrorAPI {
	success: boolean;
	message: string;
}
