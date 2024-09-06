import { type UseMutation, useMutation } from "@vigilio/preact-fetching";
import {
	CategoriesUpdateImageDto,
	type CategoriesUpdateDto,
} from "../../dtos/categories.update.dto";
import type { CategoriesSchemaFromServer } from "../../schemas/categories.schema";
import { ResultApiImages, uploadApi } from "~/libs/upload";
import { categoriesUploadImages } from "./categories.store.api";

export function categoriesUpdateApi(
	slug: number | string,
): UseMutation<
	CategoriesUpdateAPI,
	CategoriesUpdateDto,
	categoriesUpdateErrorAPI
> {
	return useMutation(`/categories/${slug}`, async (url, body) => {
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
export function categoriesUpdateImagesApi(slug: string | number) {
	return useMutation<
		ResultApiImages,
		CategoriesUpdateImageDto & { name: string },
		categoriesUpdateErrorAPI
	>(`${categoriesUploadImages}/${slug}`, async (url, body) => {
		const result = await uploadApi(`/api${url}`, {
			name: body.name,
			file: body.image,
		});
		return result;
	});
}
export interface CategoriesUpdateAPI {
	success: boolean;
	category: CategoriesSchemaFromServer;
}
export interface categoriesUpdateErrorAPI {
	success: boolean;
	message: string;
	body: keyof CategoriesUpdateDto;
}
