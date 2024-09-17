import { useMutation } from "@vigilio/preact-fetching";

export function settingsDominioUpdateApi() {
	return useMutation<
		SettingsDominioUpdateAPI,
		{ host: string | null },
		SettingsDominioUpdateApiError
	>("/empresas/dominio", async (url, body) => {
		const response = await fetch(`/api${url}`, {
			method: "PUT",
			body: JSON.stringify(body),
			headers: {
				"content-type": "application/json",
			},
		});
		const result = await response.json();
		if (!result.success) throw result;
		return result;
	});
}

interface SettingsDominioUpdateAPI {
	success: true;
	message: string;
}

interface SettingsDominioUpdateApiError {
	success: true;
	message: string;
	body: keyof { host: string | null };
}
