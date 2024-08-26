import enviroments from "~/config";
import {
	type UseQuery,
	useQuery,
	type OptionsQuery,
} from "@vigilio/preact-fetching";
import type { CategoriesSchemaFromServer } from "../../schemas/categories.schema";

export type CategoriesIndexApiMethod = UseQuery<CategoriesIndexAPI, unknown>;

export function categoriesIndexApi(
	options?: OptionsQuery<CategoriesIndexAPI, unknown>,
): CategoriesIndexApiMethod {
	return useQuery(
		"/categories",
		async (url) => {
			const response = await fetch(`${enviroments.VITE_URL}/api${url}`);
			const result: CategoriesIndexAPI = await response.json();
			if (!result.success) throw result;
			return result;
		},
		options,
	);
}

export interface CategoriesIndexAPI {
	success: boolean;
	data: CategoriesSchemaFromServer[];
}
