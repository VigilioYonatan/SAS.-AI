import enviroments from "~/config";
import { useMutation, useQuery } from "@vigilio/preact-fetching";
import { uploadApi, type ResultApiImages } from "~/libs/upload";
import { array, instance, object, type Input } from "@vigilio/valibot";
import validFileValibot from "~/libs/valibot";
import type { ImagesSchema } from "../schemas/images.schema";

export function imagesIndexApi() {
	return useQuery("/images", async (url) => {
		const response = await fetch(`${enviroments.VITE_URL}/api${url}`);
		const result: NewIndexAPI = await response.json();
		if (!result.success) throw result;
		return result;
	});
}

export const backgroundUploadImage = "/uploads/images/image";

export const imagesUpdateDto = object({
	image: array(instance(File), "Este campo es obligatorio", [
		validFileValibot({
			required: false,
			min: 1,
			max: 1,
		}),
	]),
});
export type ImagesUpdateDto = Input<typeof imagesUpdateDto>;

export function imagesUpdateApi(id: number) {
	return useMutation<ResultApiImages, ImagesUpdateDto, { success: false }>(
		`${backgroundUploadImage}/${id}`,
		async (url, body) => {
			const result = await uploadApi(`${enviroments.VITE_URL}/api${url}`, {
				file: body.image,
			});
			return result;
		},
	);
}
export interface NewIndexAPI {
	success: boolean;
	data: ImagesSchema[];
}

export interface Logo {
	dimension: number;
	file: string;
}
