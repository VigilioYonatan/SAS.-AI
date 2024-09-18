import { useMutation } from "@vigilio/preact-fetching";

export function aiImagesApi() {
	return useMutation<AIImagesApi, string, AISendMessageApiError>(
		"/ia/images",
		async (url, body) => {
			const response = await fetch(`/api${url}/${body}`);
			const result: AIImagesApi = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}
interface AIImagesApi {
	success: true;
	data: {
		images: { image: string; preview: string }[];
	};
}
interface AISendMessageApiError {
	success: true;
	message: string;
}
