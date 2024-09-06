import { ProductsNormalStoreDto } from "@/products/dtos/products_normal.dto";
import { ProductsNormalSchemaFromServer } from "@/products/schemas/products_normal.schema";
import { useMutation } from "@vigilio/preact-fetching";
import { uploadApi } from "~/libs/upload";

export const storeUploadImages = "/uploads/products/images";

export function productsNormalStoreApi() {
	return useMutation<
		ProductsNormalStoreAPI,
		ProductsNormalStoreDto,
		ProductsNormalStoreErrorAPI
	>("/products/normal", async (url, body) => {
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

export interface ProductsNormalStoreAPI {
	success: boolean;
	product: ProductsNormalSchemaFromServer;
}

export interface ProductsNormalStoreErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
