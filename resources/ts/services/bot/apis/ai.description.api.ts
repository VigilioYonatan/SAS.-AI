import { useMutation } from "@vigilio/preact-fetching";

export function aiDescriptionApi() {
	return useMutation<AISendMessageApi, string, AISendMessageApiError>(
		"/bot/description",
		async (url, body) => {
			const response = await fetch(`/api${url}/${body}`);
			const result: AISendMessageApi = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}
interface AISendMessageApi {
	success: true;
	description: string;
}
interface AISendMessageApiError {
	success: true;
	message: string;
}
