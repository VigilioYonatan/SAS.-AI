import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import { CategoriesFinanzasSchemaFromServer } from "../schemas/tipo.schema";

export function categoriesFinanzasShowApi(
    code: number
): UseQuery<CategoriesFinanzasShowAPI, CategoriesFinanzasShowErrorAPI> {
    return useQuery<CategoriesFinanzasShowAPI, CategoriesFinanzasShowErrorAPI>(
        `/categories_finanzas/${code}`,
        async (url) => {
            const response = await fetch(`/api${url}`);
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        }
    );
}

export interface CategoriesFinanzasShowAPI {
    success: boolean;
    category_finanza: CategoriesFinanzasSchemaFromServer;
}

export interface CategoriesFinanzasShowErrorAPI {
    success: boolean;
    message: string;
}
