import { useMutation } from "@vigilio/preact-fetching";
import { CategoriesFinanzasStoreDto } from "../dtos/categories.store.dto";
import { CategoriesFinanzasSchemaFromServer } from "../schemas/tipo.schema";

export function categoriesFinanzasStoreApi() {
    return useMutation<
        CategoriesFinanzasStoreAPI,
        CategoriesFinanzasStoreDto,
        CategoriesFinanzasStoreErrorAPI
    >("/categories_finanzas", async (url, body) => {
        const response = await fetch(`/api${url}`, {
            body: JSON.stringify(body),
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
        });
        const result = await response.json();
        if (!result.success) throw result;
        return result;
    });
}

export interface CategoriesFinanzasStoreAPI {
    success: boolean;
    category_finanza: CategoriesFinanzasSchemaFromServer;
}

export interface CategoriesFinanzasStoreErrorAPI {
    success: boolean;
    message: string;
    body: string;
}
