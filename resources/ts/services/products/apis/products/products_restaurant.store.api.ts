import { ProductsRestaurantStoreDto } from "@/products/dtos/products_restaurant.dto";
import { useMutation } from "@vigilio/preact-fetching";
import { uploadApi } from "~/libs/upload";
import { storeUploadImages } from "./products_normal.store.api";
import { ProductsRestaurantSchemaFromServer } from "@/products/schemas/products_restaurant.schema";

export function productsRestaurantStoreApi() {
	return useMutation<
		ProductsRestaurantStoreAPI,
		ProductsRestaurantStoreDto,
		ProductsRestaurantStoreErrorAPI
	>("/products/restaurant", async (url, body) => {
		let images = null;
		if (body.images) {
			const result = await uploadApi(`/api${storeUploadImages}`, {
				name: body.name,
				file: body.images,
			});
			images = result.files;
		}

		const response = await fetch(`/api${url}`, {
			body: JSON.stringify({ ...body, images }),
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

export interface ProductsRestaurantStoreAPI {
	success: boolean;
	product: ProductsRestaurantSchemaFromServer;
}

export interface ProductsRestaurantStoreErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
