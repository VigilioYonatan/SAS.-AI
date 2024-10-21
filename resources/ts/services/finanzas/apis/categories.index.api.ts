import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import {
	CategoryFinanzasSchema,
	TipoFinanzasSchema,
} from "../schemas/tipo.schema";

export function categoriesIndexApi(): UseQuery<
	CategoriesIndexAPI,
	CategoriesIndexErrorAPI
> {
	return useQuery<CategoriesIndexAPI, CategoriesIndexErrorAPI>(
		"/categories_finanzas",
		async (url) => {
			const response = await fetch(`/api${url}`);
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}

export interface CategoriesIndexAPI {
	success: boolean;
	data: (TipoFinanzasSchema & {
		categoriesFinanzas: CategoryFinanzasSchema[];
	})[];
}

export interface CategoriesIndexErrorAPI {
	success: boolean;
	message: string;
}
