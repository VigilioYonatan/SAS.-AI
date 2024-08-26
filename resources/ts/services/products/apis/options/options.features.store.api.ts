import type { FeaturesStoreDto } from "@/products/dtos/options/features.store.dto";
import type { OptionsSchema } from "@/products/schemas/options/options.schema";
import { useMutation } from "@vigilio/preact-fetching";
import enviroments from "~/config";

export function optionsFeaturesStoreApi() {
	return useMutation<
		OptionsFeaturesStoreAPI,
		FeaturesStoreDto & { id: number },
		OptionsFeaturesStoreErrorAPI
	>("/options", async (url, body) => {
		const { id, ...rest } = body;
		const response = await fetch(
			`${enviroments.VITE_URL}/api${url}/${id}/features`,
			{
				body: JSON.stringify(rest),
				method: "POST",
				headers: {
					"content-type": "application/json",
				},
			},
		);
		const result = await response.json();

		if (!result.success) throw result;
		return result;
	});
}

export interface OptionsFeaturesStoreAPI {
	success: boolean;
	option: OptionsSchema;
}

export interface OptionsFeaturesStoreErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
