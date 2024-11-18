import { settingsAdd } from "@/admin/components/SettingsProduct";
import { useMutation } from "@vigilio/preact-fetching";

export function aiCategoryApi() {
	return useMutation<AICategoryApi, string, AISendMessageApiError>(
		"/ia/category",
		async (url, body) => {
			const query = new URLSearchParams();

			if (settingsAdd.value?.images) {
				query.append("images", "true");
			}

			const response = await fetch(`/api${url}/${body}?${query}`);
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
		ico: string;
	};
}
interface AISendMessageApiError {
	success: true;
	message: string;
}
