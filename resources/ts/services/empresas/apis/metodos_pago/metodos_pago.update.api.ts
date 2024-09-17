import { EmpresasUpdateDto } from "@/empresas/dtos/empresas.update.dto";
import {
	empresaQrPlinUpdateDto,
	empresaQrYapeUpdateDto,
	MetodosPagoUpdateDto,
} from "@/empresas/dtos/metodosPago.update.dto";
import { useMutation } from "@vigilio/preact-fetching";
import { ResultApiImages, uploadApi } from "~/libs/upload";

export function metodosUpdateApi() {
	return useMutation<
		MetodosUpdateAPI,
		MetodosPagoUpdateDto,
		MetodosUpdateErrorAPI
	>("/empresas/metodos_pago", async (url, body) => {
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

export function empresaUpdateQrYapeApi() {
	return useMutation<
		ResultApiImages,
		empresaQrYapeUpdateDto,
		empresaUpdateErrorAPI
	>("/uploads/metodos_pago/qrYape/1", async (url, body) => {
		const result = await uploadApi(`/api${url}`, {
			file: body.qrYape,
		});
		return result;
	});
}
export function empresaUpdateQrPlinApi() {
	return useMutation<
		ResultApiImages,
		empresaQrPlinUpdateDto,
		empresaUpdateErrorAPI
	>("/uploads/metodos_pago/qrPlin/1", async (url, body) => {
		const result = await uploadApi(`/api${url}`, {
			file: body.qrPlin,
		});
		return result;
	});
}
interface empresaUpdateErrorAPI {
	success: false;
	message: string;
	body: keyof EmpresasUpdateDto;
}
