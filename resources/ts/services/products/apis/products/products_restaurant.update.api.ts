import { ProductsUpdateImagesDto } from "@/products/dtos/products_normal.dto";
import { useMutation } from "@vigilio/preact-fetching";
import { uploadApi, type ResultApiImages } from "~/libs/upload";
import { storeUploadImages } from "./products_normal.store.api";
import { ProductsNormalSchemaFromServer } from "@/products/schemas/products_normal.schema";
import { ProductsRestaurantUpdateDto } from "@/products/dtos/products_restaurant.dto";

export function productsRestaurantUpdateApi(slug: string | number) {
	return useMutation<
		ProductsRestaurantUpdateAPI,
		ProductsRestaurantUpdateDto,
		ProductsRestaurantUpdateErrorAPI
	>(`/products/${slug}`, async (url, body) => {
		const response = await fetch(`/api${url}/restaurant`, {
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
export function productsUpdateImagesApi(slug: string | number) {
	return useMutation<
		ResultApiImages,
		ProductsUpdateImagesDto & { name: string },
		ProductsRestaurantUpdateErrorAPI
	>(`${storeUploadImages}/${slug}`, async (url, body) => {
		const result = await uploadApi(`/api${url}`, {
			name: body.name,
			file: body.images,
		});
		return result;
	});
}
export interface ProductsRestaurantUpdateImagesAPI {
	success: boolean;
	message: string;
}

export interface ProductsRestaurantUpdateAPI {
	success: boolean;
	product: ProductsNormalSchemaFromServer;
}
export interface ProductsRestaurantUpdateErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
