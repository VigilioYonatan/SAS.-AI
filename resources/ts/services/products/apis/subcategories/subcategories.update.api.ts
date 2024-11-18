import { type UseMutation, useMutation } from "@vigilio/preact-fetching";
import {
	type SubcategoriesUpdateDto,
	type SubcategoriesUpdateImageDto,
} from "../../dtos/subcategories.update.dto";
import type { SubcategoriesSchemaFromServer } from "../../schemas/subcategories.schema";
import { uploadApi, type ResultApiImages } from "~/libs/upload";
import { subcategoriesStoreUploadImage } from "./subcategories.store.api";

export function subcategoriesUpdateApi(
	slug: number | string,
): UseMutation<
	SubcategoriesUpdateAPI,
	SubcategoriesUpdateDto,
	subcategoriesUpdateErrorAPI
> {
	return useMutation(`/subcategories/${slug}`, async (url, body) => {
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

export function subcategoriesUpdateImageApi(
	slug: string | number,
): UseMutation<
	ResultApiImages,
	SubcategoriesUpdateImageDto & { name: string },
	subcategoriesUpdateErrorAPI
> {
	return useMutation(
		`${subcategoriesStoreUploadImage}/${slug}`,
		async (url, body) => {
			const result = await uploadApi(`/api${url}`, {
				name: body.name,
				file: body.image,
			});
			return result;
		},
	);
}

export interface SubcategoriesUpdateAPI {
	success: boolean;
	subcategory: SubcategoriesSchemaFromServer;
}
export interface subcategoriesUpdateErrorAPI {
	success: boolean;
	message: string;
	body: keyof SubcategoriesUpdateDto;
}
