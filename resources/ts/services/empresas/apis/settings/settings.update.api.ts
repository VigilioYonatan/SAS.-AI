import {
	SettingsBackgrounAuthUpdateDto,
	SettingsUpdateDto,
} from "@/empresas/dtos/settings.update.dto";
import { useMutation } from "@vigilio/preact-fetching";
import { ResultApiImages, uploadApi } from "~/libs/upload";
export const storeUploadBackgroundAuthBanner =
	"/uploads/settings/background_auth";

export function settingsUpdateApi() {
	return useMutation<
		SettingsUpdateAPI,
		SettingsUpdateDto,
		SettingsUpdateApiError
	>("/settings", async (url, body) => {
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
export function settingsBackgroundAuthUpdateApi() {
	return useMutation<
		ResultApiImages,
		SettingsBackgrounAuthUpdateDto,
		SettingsUpdateApiError
	>(`${storeUploadBackgroundAuthBanner}/1`, async (url, body) => {
		const result = await uploadApi(`/api${url}`, {
			file: body.background_auth,
		});
		return result;
	});
}

interface SettingsUpdateAPI {
	success: true;
	message: string;
}

interface SettingsUpdateApiError {
	success: true;
	message: string;
	body: keyof SettingsUpdateDto;
}
