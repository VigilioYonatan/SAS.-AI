import { useMutation } from "@vigilio/preact-fetching";
import enviroments from "~/config";

export function optionsDestroyApi() {
	return useMutation<OptionsDestroyAPI, number, OptionsDestroyErrorAPI>(
		"/options",
		async (url, body) => {
			const response = await fetch(
				`${enviroments.VITE_URL}/api${url}/${body}`,
				{
					method: "DELETE",
					headers: {
						"content-type": "application/json",
					},
				},
			);
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}

export interface OptionsDestroyAPI {
	success: boolean;
	message: string;
}

export interface OptionsDestroyErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
