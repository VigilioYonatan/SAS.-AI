import { useMutation, type UseMutation } from "@vigilio/preact-fetching";
import enviroments from "~/config";
import type { InformationSchema } from "@/information/schemas/information.schema";
import { uploadApi, type ResultApiImages } from "~/libs/upload";
import type {
	InformationFacturacionCertificadoUpdateDto,
	InformationFacturacionUpdateDto,
} from "../dtos/information.facturacion.update.dto";
export const uploadInformationFacturacionUpdateApi =
	"/uploads/information/certificado";

export function informationFacturacionUpdateApi(): UseMutation<
	InformationFacturacionUpdateApi,
	InformationFacturacionUpdateDto,
	InformationFacturacionUpdateApi
> {
	return useMutation("/information/company", async (url, body) => {
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
export function informationFacturacionCertificadoUpdateApi(): UseMutation<
	ResultApiImages,
	InformationFacturacionCertificadoUpdateDto,
	InformationFacturacionUpdateApi
> {
	return useMutation(
		uploadInformationFacturacionUpdateApi,
		async (url, body) => {
			const result = await uploadApi(`${enviroments.VITE_URL}/api${url}/1`, {
				file: body.certificado,
			});
			return result;
		},
	);
}
interface InformationFacturacionUpdateApi {
	success: true;
	information: InformationSchema;
}
interface InformationFacturacionUpdateApi {
	success: true;
	message: string;
	body: keyof InformationFacturacionCertificadoUpdateDto;
}
