import enviroments from "~/config";
import { useMutation } from "@vigilio/preact-fetching";
import type {
	RuletaUpdateDto,
	RuletaUpdateImageDto,
} from "@/information/dtos/ruleta.update.dto";
import { uploadApi, type ResultApiImages } from "~/libs/upload";

export function ruletaUpdateApi(id: number) {
	return useMutation<RuletaUpdateAPI, RuletaUpdateDto, RuletaUpdateErrorAPI>(
		`/ruleta/${id}`,
		async (url, body) => {
			const response = await fetch(`${enviroments.VITE_URL}/api${url}`, {
				method: "PUT",
				body: JSON.stringify(body),
				headers: {
					"Content-type": "application/json",
				},
			});
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}

export const ruletaUploadImage = "/uploads/ruleta/image";
export function ruletaUpdateImageApi(id: number) {
	return useMutation<ResultApiImages, RuletaUpdateImageDto, ResultApiImages>(
		`${ruletaUploadImage}/${id}`,
		async (url, body) => {
			const result = await uploadApi(`${enviroments.VITE_URL}/api${url}`, {
				file: body.image,
			});
			return result;
		},
	);
}

export interface RuletaUpdateAPI {
	success: boolean;
	message: string;
}

export interface RuletaUpdateErrorAPI {
	success: boolean;
	body: keyof RuletaUpdateDto;
	message: string;
}
