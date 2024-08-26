import enviroments from "~/config";
import { type UseMutation, useMutation } from "@vigilio/preact-fetching";
import type {
	InformationIconUpdateDto,
	InformationLogoUpdateDto,
	InformationQrPlinUpdateDto,
	InformationQrYapeUpdateDto,
	InformationUpdateDto,
} from "../dtos/information.update.dto";
import type { InformationSchemaFromServer } from "../schemas/information.schema";
import { uploadApi, type ResultApiImages } from "~/libs/upload";

export function informationUpdateApi(): UseMutation<
	InformationUpdateAPI,
	InformationUpdateDto,
	InformationUpdateErrorAPI
> {
	return useMutation("/information", async (url, body) => {
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
export function informationUpdateLogoApi() {
	return useMutation<
		ResultApiImages,
		InformationLogoUpdateDto & { name: string },
		InformationUpdateErrorAPI
	>("/uploads/information/logo/1", async (url, body) => {
		const result = await uploadApi(`${enviroments.VITE_URL}/api${url}`, {
			file: body.logo,
			name: body.name,
		});
		return result;
	});
}
export function informationUpdateIconApi() {
	return useMutation<
		ResultApiImages,
		InformationIconUpdateDto & { name: string },
		InformationUpdateErrorAPI
	>("/uploads/information/icon/1", async (url, body) => {
		const result = await uploadApi(`${enviroments.VITE_URL}/api${url}`, {
			file: body.icon,
			name: body.name,
		});
		return result;
	});
}
export function informationUpdateQrYapeApi() {
	return useMutation<
		ResultApiImages,
		InformationQrYapeUpdateDto,
		InformationUpdateErrorAPI
	>("/uploads/information/qrYape/1", async (url, body) => {
		const result = await uploadApi(`${enviroments.VITE_URL}/api${url}`, {
			file: body.qrYape,
		});
		return result;
	});
}
export function informationUpdateQrPlinApi() {
	return useMutation<
		ResultApiImages,
		InformationQrPlinUpdateDto,
		InformationUpdateErrorAPI
	>("/uploads/information/qrPlin/1", async (url, body) => {
		const result = await uploadApi(`${enviroments.VITE_URL}/api${url}`, {
			file: body.qrPlin,
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
