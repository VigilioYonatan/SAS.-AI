import { useMutation } from "@vigilio/preact-fetching";
import { CitasSettingsUpdateDto } from "../dtos/citas_settings.update.dto";

export function citasSettingsUpdateApi() {
	return useMutation<
		CitasSettingsUpdateAPI,
		CitasSettingsUpdateDto,
		CitasSettingsUpdateErrorAPI
	>("/citas/setting", async (url, body) => {
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

export interface CitasSettingsUpdateAPI {
	success: boolean;
	message: string;
}
export interface CitasSettingsUpdateErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
