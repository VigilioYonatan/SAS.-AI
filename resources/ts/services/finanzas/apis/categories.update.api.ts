import { useMutation } from "@vigilio/preact-fetching";
import { CategoriesFinanzasStoreDto } from "../dtos/categories.store.dto";
import { CategoriesFinanzasSchemaFromServer } from "../schemas/tipo.schema";

export function categoriesFinanzasUpdateApi(code: number) {
    return useMutation<
        CategoriesFinanzasUpdateAPI,
        CategoriesFinanzasStoreDto,
        CategoriesFinanzasUpdateErrorAPI
    >(`/categories_finanzas/${code}`, async (url, body) => {
        const response = await fetch(`/api${url}`, {
            body: JSON.stringify(body),
            method: "PUT",
            headers: {
                "content-type": "application/json",
            },
        });
        const result = await response.json();
        if (!result.success) throw result;
        return result;
    });
}

export interface CategoriesFinanzasUpdateAPI {
    success: boolean;
    category_finanza: CategoriesFinanzasSchemaFromServer;
}

export interface CategoriesFinanzasUpdateErrorAPI {
    success: boolean;
    message: string;
    body: string;
}
