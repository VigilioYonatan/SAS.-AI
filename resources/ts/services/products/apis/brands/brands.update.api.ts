import { type UseMutation, useMutation } from "@vigilio/preact-fetching";
import type { BrandsSchemaFromServer } from "../../schemas/brands.schema";
import {
	BrandsUpdateDto,
	BrandsUpdateImagesDto,
} from "@/products/dtos/brands.update.dto";
import { ResultApiImages, uploadApi } from "~/libs/upload";
import { brandUploadImages } from "./brands.store.api";

export function brandsUpdateApi(
	slug: number | string,
): UseMutation<BrandsUpdateAPI, BrandsUpdateDto, brandsUpdateErrorAPI> {
	return useMutation(`/brands/${slug}`, async (url, body) => {
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
export function brandsUpdateImagesApi(slug: string | number) {
	return useMutation<
		ResultApiImages,
		BrandsUpdateImagesDto & { name: string },
		brandsUpdateErrorAPI
	>(`${brandUploadImages}/${slug}`, async (url, body) => {
		const result = await uploadApi(`/api${url}`, {
			name: body.name,
			file: body.image,
		});
		return result;
	});
}
export interface BrandsUpdateAPI {
	success: boolean;
	brand: BrandsSchemaFromServer;
}
export interface brandsUpdateErrorAPI {
	success: boolean;
	message: string;
	body: keyof BrandsUpdateDto;
}
