import { useMutation } from "@vigilio/preact-fetching";

export function aiBrandsApi() {
	return useMutation<AICategoryApi, string, AISendMessageApiError>(
		"/ia/brand",
		async (url, body) => {
			const response = await fetch(`/api${url}/${body}`);
			const result: AICategoryApi = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}
interface AICategoryApi {
	success: true;
	data: {
		images: { image: string; preview: string }[];
	};
}
interface AISendMessageApiError {
	success: true;
	message: string;
}
