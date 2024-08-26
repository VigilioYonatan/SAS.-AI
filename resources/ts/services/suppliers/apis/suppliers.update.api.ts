import enviroments from "~/config";
import { useMutation } from "@vigilio/preact-fetching";
import type {
	SuppliersLogoUpdateDto,
	SuppliersUpdateDto,
} from "../dtos/suppliers.update.dto";
import type { SuppliersSchemaFromServer } from "../schemas/suppliers.schema";
import { uploadApi, type ResultApiImages } from "~/libs/upload";
import { SuppliersstoreUploadLogo } from "./suppliers.store.api";

export function suppliersUpdateApi(id: number) {
	return useMutation<
		SuppliersUpdateAPI,
		SuppliersUpdateDto,
		SuppliersUpdateErrorAPI
	>(`/suppliers/${id}`, async (url, body) => {
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
export function suppliersUpdateLogoApi(slug: string | number) {
	return useMutation<
		ResultApiImages,
		SuppliersLogoUpdateDto & { razon_social: string },
		SuppliersUpdateErrorAPI
	>(`${SuppliersstoreUploadLogo}/${slug}`, async (url, body) => {
		const result = await uploadApi(`${enviroments.VITE_URL}/api${url}`, {
			name: body.razon_social,
			file: body.logo,
		});
		return result;
	});
}
export interface SuppliersUpdateAPI {
	success: boolean;
	supplier: SuppliersSchemaFromServer;
}
export interface SuppliersUpdateErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
