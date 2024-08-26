import enviroments from "~/config";
import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import type { FeaturesSchema } from "@/products/schemas/options/features.schema";
import type { OptionsSchema } from "@/products/schemas/options/options.schema";
export type OptionsFeaturesApiMethod = UseQuery<
	OptionsOptionValuesAPI,
	OptionsOptionValuesErrorAPI
>;

export function optionsFeaturesApi(): OptionsFeaturesApiMethod {
	return useQuery("/options", async (url) => {
		const response = await fetch(`${enviroments.VITE_URL}/api${url}/features`);
		const result: OptionsOptionValuesAPI = await response.json();
		if (!result.success) throw result;
		return result;
	});
}

export interface OptionsOptionValuesAPI {
	success: boolean;
	data: (OptionsSchema & { features: FeaturesSchema[] })[];
}
export interface OptionsOptionValuesErrorAPI {
	success: boolean;
	message: string;
}
