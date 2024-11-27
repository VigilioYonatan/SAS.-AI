import { useQuery, type UseQuery } from "@vigilio/preact-fetching";
import type { SubcategoriesSchema } from "@/products/schemas/subcategories.schema";

export function categoriesSubcategoriesApi(
	slug: number | string | null,
): UseQuery<CategoriesSubcategoriesAPI, CategoriesSubcategoriesErrorAPI> {
	return useQuery(
		`/categories/${slug}/subcategories`,
		async (url) => {
			const response = await fetch(`/api${url}`);
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
		{ skipFetching: true },
	);
}

export interface CategoriesSubcategoriesAPI {
	success: boolean;
	data: SubcategoriesSchema[];
}

export interface CategoriesSubcategoriesErrorAPI {
	success: boolean;
	message: string;
}
