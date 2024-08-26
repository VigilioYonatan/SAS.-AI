import { type ProductsStoreDto } from "../../dtos/products.store.dto";
import { useMutation } from "@vigilio/preact-fetching";
import { type ProductsSchemaFromServer } from "../../schemas/products.schema";
import enviroments from "~/config";
import { uploadApi } from "~/libs/upload";

export const storeUploadImages = "/uploads/products/images";

export function productsStoreApi() {
	return useMutation<ProductsStoreAPI, ProductsStoreDto, ProductsStoreErrorAPI>(
		"/products",
		async (url, body) => {
			let images = null;
			if (body.images) {
				const result = await uploadApi(
					`${enviroments.VITE_URL}/api${storeUploadImages}`,
					{
						name: body.name,
						file: body.images,
					},
				);
				images = result.files;
			}

			const response = await fetch(`${enviroments.VITE_URL}/api${url}`, {
				body: JSON.stringify({ ...body, images }),
				method: "POST",
				headers: {
					"content-type": "application/json",
				},
			});
			const result = await response.json();

			if (!result.success) throw result;
			return result;
		},
	);
}

export interface ProductsStoreAPI {
	success: boolean;
	product: ProductsSchemaFromServer;
}

export interface ProductsStoreErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
