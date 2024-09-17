import { useMutation, type UseMutation } from "@vigilio/preact-fetching";
import { uploadApi } from "~/libs/upload";
import type { BackgroundStoreDto } from "../dtos/background.store.dto";
import { BackgroundSchema } from "../schemas/background.schema";

export const backgroundUploadImage = "/uploads/background/image";
export function backgroundStoreApi(): UseMutation<
	BackgroundStoreApi,
	BackgroundStoreDto,
	BackgroundStoreApiError
> {
	return useMutation("/background", async (url, body) => {
		const resultImage = await uploadApi(`/api${backgroundUploadImage}`, {
			file: body.image,
		});
		const response = await fetch(`/api${url}`, {
			method: "POST",
			body: JSON.stringify({ ...body, image: resultImage.files }),
			headers: {
				"content-type": "application/json",
			},
		});
		const result = await response.json();
		if (!result.success) throw result;
		return result;
	});
}
interface BackgroundStoreApi {
	success: true;
	message: string;
}
interface BackgroundStoreApiError {
	success: true;
	message: string;
	body: keyof BackgroundSchema;
}
