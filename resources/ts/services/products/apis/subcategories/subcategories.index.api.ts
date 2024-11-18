import {
	type UseQuery,
	useQuery,
	type OptionsQuery,
} from "@vigilio/preact-fetching";
import type { SubcategoriesSchemaFromServer } from "../../schemas/subcategories.schema";

export type SubcategoriesIndexApiMethod = UseQuery<
	SubcategoriesIndexAPI,
	unknown
>;

export function subcategoriesIndexApi(
	options?: OptionsQuery<SubcategoriesIndexAPI, unknown>,
): SubcategoriesIndexApiMethod {
	return useQuery(
		"/subcategories",
		async (url) => {
			const response = await fetch(`/api${url}`);
			const result: SubcategoriesIndexAPI = await response.json();
			if (!result.success) throw result;
			return result;
		},
		options,
	);
}

export interface SubcategoriesIndexAPI {
	success: boolean;
	data: SubcategoriesSchemaFromServer[];
}
