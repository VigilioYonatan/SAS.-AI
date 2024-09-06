import { InformationUpdateDto } from "@/information/dtos/information.update.dto";
import {
	InformationQrPlinUpdateDto,
	InformationQrYapeUpdateDto,
	MetodosPagoUpdateDto,
} from "@/information/dtos/metodosPago.update.dto";
import { useMutation } from "@vigilio/preact-fetching";
import { ResultApiImages, uploadApi } from "~/libs/upload";

export function metodosUpdateApi() {
	return useMutation<
		MetodosUpdateAPI,
		MetodosPagoUpdateDto,
		MetodosUpdateErrorAPI
	>("/information/metodos_pago", async (url, body) => {
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

export interface MetodosUpdateAPI {
	success: boolean;
	message: string;
}
export interface MetodosUpdateErrorAPI {
	success: boolean;
	message: string;
	body: string;
}

export function informationUpdateQrYapeApi() {
	return useMutation<
		ResultApiImages,
		InformationQrYapeUpdateDto,
		InformationUpdateErrorAPI
	>("/uploads/metodos_pago/qrYape/1", async (url, body) => {
		const result = await uploadApi(`/api${url}`, {
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
	>("/uploads/metodos_pago/qrPlin/1", async (url, body) => {
		const result = await uploadApi(`/api${url}`, {
			file: body.qrPlin,
		});
		return result;
	});
}
interface InformationUpdateErrorAPI {
	success: false;
	message: string;
	body: keyof InformationUpdateDto;
}
