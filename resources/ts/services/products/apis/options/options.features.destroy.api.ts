import { useMutation } from "@vigilio/preact-fetching";
import enviroments from "~/config";

export function optionsFeaturesDestroyApi() {
	return useMutation<
		OptionsFeaturesDestroyAPI,
		{ id: number; feature_id: number },
		OptionsFeaturesDestroyErrorAPI
	>("/options", async (url, body) => {
		const response = await fetch(
			`${enviroments.VITE_URL}/api${url}/${body.id}/features/${body.feature_id}`,
			{
				body: JSON.stringify(body),
				method: "DELETE",
			},
		);
		const result = await response.json();

		if (!result.success) throw result;
		return result;
	});
}

export interface OptionsFeaturesDestroyAPI {
	success: boolean;
	message: string;
}

export interface OptionsFeaturesDestroyErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
