import { useMutation } from "@vigilio/preact-fetching";
import enviroments from "~/config";

export function aiColorApi() {
	return useMutation<AISendMessageApi, string, AISendMessageApiError>(
		"/bot/color",
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
	color: string;
}
interface AISendMessageApiError {
	success: true;
	message: string;
}
