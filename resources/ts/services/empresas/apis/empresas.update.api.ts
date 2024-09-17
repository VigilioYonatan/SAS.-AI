import { type UseMutation, useMutation } from "@vigilio/preact-fetching";
import { SettingsLogoUpdateDto } from "../dtos/settings.update.dto";
import { ResultApiImages, uploadApi } from "~/libs/upload";
import { EmpresasUpdateDto } from "../dtos/empresas.update.dto";
import { EmpresasSchemaFromServer } from "../schemas/empresas.schema";

export function empresaUpdateApi(): UseMutation<
	empresaUpdateAPI,
	EmpresasUpdateDto,
	empresaUpdateErrorAPI
> {
	return useMutation("/empresas", async (url, body) => {
		const response = await fetch(`/api${url}`, {
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
export function empresaUpdateLogoApi() {
	return useMutation<
		ResultApiImages,
		SettingsLogoUpdateDto & { name: string },
		{ success: false; message: string }
	>("/uploads/empresas/logo/1", async (url, body) => {
		const result = await uploadApi(`/api${url}`, {
			file: body.logo,
			name: body.name,
		});
		return result;
	});
}

interface empresaUpdateAPI {
	success: boolean;
	empresa: EmpresasSchemaFromServer;
}

interface empresaUpdateErrorAPI {
	success: false;
	message: string;
	body: keyof EmpresasUpdateDto;
}
