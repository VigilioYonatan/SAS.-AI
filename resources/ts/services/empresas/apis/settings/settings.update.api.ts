import {
	SettingsIconUpdateDto,
	SettingsPhotoUpdateDto,
	SettingsUpdateDto,
} from "@/empresas/dtos/settings.update.dto";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
import { useMutation } from "@vigilio/preact-fetching";
import enviroments from "~/config";
import { ResultApiImages, uploadApi } from "~/libs/upload";

export function settingsUpdateApi() {
	return useMutation<
		SettingsUpdateAPI,
		SettingsUpdateDto,
		SettingsUpdateApiError
	>(`/${storageEmpresa!.slug}/settings`, async (url, body) => {
		const response = await fetch(`/api${url}`, {
			method: "PUT",
			body: JSON.stringify(body),
			headers: {
				"content-type": "application/json",
				"access-token": enviroments.VITE_TOKEN_VIGILIO_SERVICES,
			},
		});
		const result = await response.json();
		if (!result.success) throw result;
		return result;
	});
}

export function settingsUpdateIconApi() {
	return useMutation<
		ResultApiImages,
		SettingsIconUpdateDto & { name: string },
		SettingsUpdateErrorAPI
	>("/uploads/settings/icon/1", async (url, body) => {
		const result = await uploadApi(`/api${url}`, {
			file: body.icon,
			name: body.name,
		});
		return result;
	});
}
export function settingsUpdatePhotoApi() {
	return useMutation<
		ResultApiImages,
		SettingsPhotoUpdateDto & { name: string },
		SettingsUpdateErrorAPI
	>("/uploads/settings/photo/1", async (url, body) => {
		const result = await uploadApi(`/api${url}`, {
			file: body.photo,
			name: body.name,
		});
		return result;
	});
}
interface SettingsUpdateAPI {
	success: true;
	message: string;
}
interface SettingsUpdateErrorAPI {
	success: false;
	message: string;
}

interface SettingsUpdateApiError {
	success: true;
	message: string;
	body: keyof SettingsUpdateDto;
}
