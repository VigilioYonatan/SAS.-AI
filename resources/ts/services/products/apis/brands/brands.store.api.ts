import { type UseMutation, useMutation } from "@vigilio/preact-fetching";
import type { BrandsSchemaFromServer } from "../../schemas/brands.schema";
import type { BrandsStoreDto } from "@/products/dtos/brands.store.dto";
import { uploadApi } from "~/libs/upload";

export const brandUploadImages = "/uploads/brands/image";
export function brandsStoreApi(): UseMutation<
	BrandsStoreAPI,
	BrandsStoreDto & { name: string },
	BrandsStoreErrorAPI
> {
	return useMutation("/brands", async (url, body) => {
		let image = null;
		if (body.image) {
			const result = await uploadApi(`/api${brandUploadImages}`, {
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
export interface BrandsStoreErrorAPI {
	body: keyof BrandsStoreDto;
	message: string;
	success: false;
}

export interface BrandsStoreAPI {
	success: boolean;
	brand: BrandsSchemaFromServer;
}

export interface Image {
	dimension: number;
	file: string;
}
