import { ProductsServicioStoreDto } from "@/products/dtos/products_servicio.dto";
import { ProductsServicioSchemaFromServer } from "@/products/schemas/products_servicio.schema";
import { useMutation } from "@vigilio/preact-fetching";
import { uploadApi } from "~/libs/upload";

export const storeUploadImages = "/uploads/products/images";

export function productsServicioStoreApi() {
	return useMutation<
		ProductsServicioStoreAPI,
		ProductsServicioStoreDto,
		ProductsServicioStoreErrorAPI
	>("/products/servicio", async (url, body) => {
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

export interface ProductsServicioStoreAPI {
	success: boolean;
	product: ProductsServicioSchemaFromServer;
}

export interface ProductsServicioStoreErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
