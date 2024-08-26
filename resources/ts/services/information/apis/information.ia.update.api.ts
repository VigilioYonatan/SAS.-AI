import { useMutation, type UseMutation } from "@vigilio/preact-fetching";
import enviroments from "~/config";
import type { InformationIAUpdateDto } from "../dtos/information.ia.update.dto";
export function informationIAUpdateApi(): UseMutation<
	InformationIAUpdateApi,
	InformationIAUpdateDto,
	InformationIAUpdateApiError
> {
	return useMutation("/information/ia", async (url, body) => {
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

interface InformationIAUpdateApi {
	success: true;
	message: string;
}
interface InformationIAUpdateApiError {
	success: true;
	message: string;
	body: keyof InformationIAUpdateDto;
}
