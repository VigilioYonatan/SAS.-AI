import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import { CategoriesSchemaFromServer } from "@/products/schemas/categories.schema";

export function categoriesShowApi(
    slug: number | string
): UseQuery<CategoriesShowAPI, CategoriesShowErrorAPI> {
    return useQuery(`/categories/${slug}`, async (url) => {
        const response = await fetch(`/api${url}`);
        const result = await response.json();
        if (!result.success) throw result;
        return result;
    });
}

export interface CategoriesShowAPI {
    success: boolean;
    category: CategoriesSchemaFromServer;
}

export interface CategoriesShowErrorAPI {
    success: boolean;
    message: string;
}
