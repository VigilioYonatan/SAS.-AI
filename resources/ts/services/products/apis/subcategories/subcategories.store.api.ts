import { type SubcategoriesStoreDto } from "../../dtos/subcategories.store.dto";
import { type UseMutation, useMutation } from "@vigilio/preact-fetching";
import type { SubcategoriesSchemaFromServer } from "../../schemas/subcategories.schema";
import { uploadApi } from "~/libs/upload";

export const subcategoriesStoreUploadImage = "/uploads/subcategories/image";

export function subcategoriesStoreApi(): UseMutation<
	SubcategoriesStoreAPI,
	SubcategoriesStoreDto,
	SubcategoriesStoreErrorAPI
> {
	return useMutation("/subcategories", async (url, body) => {
		const files = await uploadApi(`/api${subcategoriesStoreUploadImage}`, {
			file: body.image,
			name: body.name,
		});
		const response = await fetch(`/api${url}`, {
			body: JSON.stringify({ ...body, image: files.files }),
			method: "POST",
			headers: {
				"content-type": "application/json",
			},
		});
		const result = await response.json();

		if (!result.success) throw result;
		return result;
	});
}
export interface SubcategoriesStoreErrorAPI {
	body: keyof SubcategoriesStoreDto;
	message: string;
	success: false;
}

export interface SubcategoriesStoreAPI {
	success: boolean;
	subcategory: SubcategoriesSchemaFromServer;
}

export interface Image {
	dimension: number;
	file: string;
}
