import enviroments from "~/config";
import { useMutation } from "@vigilio/preact-fetching";
import {
	type ProductsUpdateDto,
	type ProductsUpdateImagesDto,
} from "../../dtos/products.update.dto";
import { type ProductsSchemaFromServer } from "../../schemas/products.schema";
import { uploadApi, type ResultApiImages } from "~/libs/upload";
import { storeUploadImages } from "./products.store.api";

export function productsUpdateApi(slug: string | number) {
	return useMutation<
		ProductsUpdateAPI,
		ProductsUpdateDto,
		ProductsUpdateErrorAPI
	>(`/products/${slug}`, async (url, body) => {
		const response = await fetch(`${enviroments.VITE_URL}/api${url}`, {
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
		ProductsUpdateErrorAPI
	>(`${storeUploadImages}/${slug}`, async (url, body) => {
		const result = await uploadApi(`${enviroments.VITE_URL}/api${url}`, {
			name: body.name,
			file: body.images,
		});
		return result;
	});
}
export interface ProductsUpdateImagesAPI {
	success: boolean;
	message: string;
}

export interface ProductsUpdateAPI {
	success: boolean;
	product: ProductsSchemaFromServer;
}
export interface ProductsUpdateErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
