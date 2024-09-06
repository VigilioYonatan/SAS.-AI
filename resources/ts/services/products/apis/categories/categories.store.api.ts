import { type CategoriesStoreDto } from "../../dtos/categories.store.dto";
import { type UseMutation, useMutation } from "@vigilio/preact-fetching";
import type { CategoriesSchemaFromServer } from "../../schemas/categories.schema";
import { uploadApi } from "~/libs/upload";

export const categoriesUploadImages = "/uploads/categories/image";

export function categoriesStoreApi(): UseMutation<
	CategoriesStoreAPI,
	CategoriesStoreDto,
	CategoriesStoreErrorAPI
> {
	return useMutation("/categories", async (url, body) => {
		let image = null;
		if (body.image) {
			const result = await uploadApi(`/api${categoriesUploadImages}`, {
				name: body.name,
				file: body.image,
			});
			image = result.files;
		}
		const response = await fetch(`/api${url}`, {
			body: JSON.stringify({ ...body, image }),
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
export interface CategoriesStoreErrorAPI {
	body: keyof CategoriesStoreDto;
	message: string;
	success: false;
}

export interface CategoriesStoreAPI {
	success: boolean;
	category: CategoriesSchemaFromServer;
}

export interface Image {
	dimension: number;
	file: string;
}
