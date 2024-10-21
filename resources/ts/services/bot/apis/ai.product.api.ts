import { useMutation } from "@vigilio/preact-fetching";

export function aiProductApi() {
	return useMutation<AIProductApi, string, AISendMessageApiError>(
		"/ia/product",
		async (url, body) => {
			const response = await fetch(`/api${url}/${body}`);
			const result: AIProductApi = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}
interface AIProductApi {
	success: true;
	data: {
		images: { image: string; preview: string }[];
		description: string;
		caracterisiticas: { key: string; value: string }[];
		product_key: string | null;
	};
}
interface AISendMessageApiError {
	success: true;
	message: string;
}
