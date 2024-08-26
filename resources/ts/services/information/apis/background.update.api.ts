import enviroments from "~/config";
import { useMutation } from "@vigilio/preact-fetching";
import type {
	BackgroundImageUpdateDto,
	BackgroundUpdateDto,
} from "../dtos/background.update.dto";
import type { BackgroundSchemaFromServer } from "../schemas/background.schema";
import { uploadApi, type ResultApiImages } from "~/libs/upload";
import { backgroundUploadImage } from "./background.store.api";

export function backgroundUpdateApi(id: number) {
	return useMutation<
		BackgroundUpdateAPI,
		BackgroundUpdateDto,
		BackgroundUpdateErrorAPI
	>(`/background/${id}`, async (url, body) => {
		const response = await fetch(`${enviroments.VITE_URL}/api${url}`, {
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
export function backgroundUpdateImageApi(id: number) {
	return useMutation<
		ResultApiImages,
		BackgroundImageUpdateDto,
		BackgroundUpdateErrorAPI
	>(`${backgroundUploadImage}/${id}`, async (url, body) => {
		const result = await uploadApi(`${enviroments.VITE_URL}/api${url}`, {
			file: body.image,
		});
		return result;
	});
}
export interface BackgroundUpdateAPI {
	success: boolean;
	background: BackgroundSchemaFromServer;
}
export interface BackgroundUpdateErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
