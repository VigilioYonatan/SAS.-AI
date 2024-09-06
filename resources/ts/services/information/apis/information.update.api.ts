import { type UseMutation, useMutation } from "@vigilio/preact-fetching";
import type { InformationUpdateDto } from "../dtos/information.update.dto";
import type { InformationSchemaFromServer } from "../schemas/information.schema";
import { SettingsLogoUpdateDto } from "../dtos/settings.update.dto";
import { ResultApiImages, uploadApi } from "~/libs/upload";

export function informationUpdateApi(): UseMutation<
	InformationUpdateAPI,
	InformationUpdateDto,
	InformationUpdateErrorAPI
> {
	return useMutation("/information", async (url, body) => {
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
export function informationUpdateLogoApi() {
	return useMutation<
		ResultApiImages,
		SettingsLogoUpdateDto & { name: string },
		{ success: false; message: string }
	>("/uploads/information/logo/1", async (url, body) => {
		const result = await uploadApi(`/api${url}`, {
			file: body.logo,
			name: body.name,
		});
		return result;
	});
}

interface InformationUpdateAPI {
	success: boolean;
	information: InformationSchemaFromServer;
}

interface InformationUpdateErrorAPI {
	success: false;
	message: string;
	body: keyof InformationUpdateDto;
}
