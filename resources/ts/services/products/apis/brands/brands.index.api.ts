import {
	type UseQuery,
	useQuery,
	type OptionsQuery,
} from "@vigilio/preact-fetching";
import type { BrandsSchemaFromServer } from "../../schemas/brands.schema";

export type BrandsIndexApiMethod = UseQuery<BrandsIndexAPI, unknown>;

export function brandsIndexApi(
	options?: OptionsQuery<BrandsIndexAPI, unknown>,
): BrandsIndexApiMethod {
	return useQuery(
		"/brands",
		async (url) => {
			const response = await fetch(`/api${url}`);
			const result: BrandsIndexAPI = await response.json();
			if (!result.success) throw result;
			return result;
		},
		options,
	);
}

export interface BrandsIndexAPI {
	success: boolean;
	data: BrandsSchemaFromServer[];
}
