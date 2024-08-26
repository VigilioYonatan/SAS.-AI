import { useMutation } from "@vigilio/preact-fetching";
import enviroments from "~/config";

export function aiDescriptionApi() {
	return useMutation<AISendMessageApi, string, AISendMessageApiError>(
		"/bot/description",
		async (url, body) => {
			const response = await fetch(`${enviroments.VITE_URL}/api${url}/${body}`);
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
