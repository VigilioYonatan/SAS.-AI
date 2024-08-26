import { useMutation, type UseMutation } from "@vigilio/preact-fetching";
import enviroments from "~/config";
import type { InformationAddressUpdateDto } from "../dtos/information.address.update.dto";
export function informationAddressUpdateApi(): UseMutation<
	InformationAddressUpdateApi,
	InformationAddressUpdateDto,
	InformationAddressUpdateApiError
> {
	return useMutation("/information/address", async (url, body) => {
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

interface InformationAddressUpdateApi {
	success: true;
	message: string;
}
interface InformationAddressUpdateApiError {
	success: true;
	message: string;
	body: keyof InformationAddressUpdateDto;
}
