import { useMutation } from "@vigilio/preact-fetching";

export function aiColorApi() {
	return useMutation<AISendMessageApi, string, AISendMessageApiError>(
		"/bot/color",
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
	color: string;
}
interface AISendMessageApiError {
	success: true;
	message: string;
}
