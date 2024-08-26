import { type UseMutation, useMutation } from "@vigilio/preact-fetching";
import enviroments from "~/config";
import { uploadApi } from "~/libs/upload";
import type { BrandsSchemaFromServer } from "../../schemas/brands.schema";
import type { BrandsStoreDto } from "@/products/dtos/brands.store.dto";

export const brandsStoreUploadImage = "/uploads/brands/image";

export function brandsStoreApi(): UseMutation<
	BrandsStoreAPI,
	BrandsStoreDto,
	BrandsStoreErrorAPI
> {
	return useMutation("/brands", async (url, body) => {
		const resultImage = await uploadApi(
			`${enviroments.VITE_URL}/api/${brandsStoreUploadImage}`,
			{
				name: body.name,
				file: body.image,
			},
		);

		const response = await fetch(`${enviroments.VITE_URL}/api${url}`, {
			body: JSON.stringify({
				...body,
				image: resultImage.files,
			}),
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
