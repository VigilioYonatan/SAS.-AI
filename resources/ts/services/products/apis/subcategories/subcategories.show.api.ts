import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import { type SubcategoriesSchemaFromServer } from "../../schemas/subcategories.schema";

export function subcategoriesShowApi(
	slug: number | string,
): UseQuery<SubcategoriesShowAPI, SubcategoriesShowErrorAPI> {
	return useQuery(`/subcategories/${slug}`, async (url) => {
		const response = await fetch(`/api${url}`);
		const result = await response.json();
		if (!result.success) throw result;
		return result;
	});
}

export interface SubcategoriesShowAPI {
	success: boolean;
	subcategory: SubcategoriesSchemaFromServer;
}

export interface SubcategoriesShowErrorAPI {
	success: boolean;
	message: string;
}
