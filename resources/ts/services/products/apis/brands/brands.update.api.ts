import enviroments from "~/config";
import { type UseMutation, useMutation } from "@vigilio/preact-fetching";
import type { BrandsSchemaFromServer } from "../../schemas/brands.schema";
import { brandsStoreUploadImage } from "./brands.store.api";
import { uploadApi, type ResultApiImages } from "~/libs/upload";
import type {
	BrandsUpdateDto,
	BrandsUpdateImageDto,
} from "@/products/dtos/brands.update.dto";

export function brandsUpdateApi(
	slug: number | string,
): UseMutation<BrandsUpdateAPI, BrandsUpdateDto, brandsUpdateErrorAPI> {
	return useMutation(`/brands/${slug}`, async (url, body) => {
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

export function brandsUpdateImageApi(
	slug: string | number,
): UseMutation<
	ResultApiImages,
	BrandsUpdateImageDto & { name: string },
	brandsUpdateErrorAPI
> {
	return useMutation(`${brandsStoreUploadImage}/${slug}`, async (url, body) => {
		const result = await uploadApi(`${enviroments.VITE_URL}/api${url}`, {
			name: body.name,
			file: body.image,
		});
		return result;
	});
}

export interface BrandsUpdateAPI {
	success: boolean;
	brand: BrandsSchemaFromServer;
}
export interface brandsUpdateErrorAPI {
	success: boolean;
	message: string;
	body: keyof BrandsUpdateDto;
}
