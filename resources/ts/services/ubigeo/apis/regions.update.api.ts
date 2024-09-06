import { useMutation } from "@vigilio/preact-fetching";
import { RegionsUpdateDto } from "../dtos/regions.update.dto";

export function regionsUpdateApi(id: string) {
	return useMutation<RegionsUpdateAPI, RegionsUpdateDto, RegionsUpdateErrorAPI>(
		`/ubigeo/regions/${id}`,
		async (url, body) => {
			const response = await fetch(`/api${url}`, {
				method: "PUT",
				body: JSON.stringify(body),
				headers: {
					"Content-Type": "Application/json",
				},
			});
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}

export interface RegionsUpdateAPI {
	success: boolean;
	message: string;
}
export interface RegionsUpdateErrorAPI {
	success: boolean;
	message: string;
	body: keyof RegionsUpdateDto;
}
