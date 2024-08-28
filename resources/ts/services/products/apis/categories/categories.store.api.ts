import { type CategoriesStoreDto } from "../../dtos/categories.store.dto";
import { type UseMutation, useMutation } from "@vigilio/preact-fetching";
import type { CategoriesSchemaFromServer } from "../../schemas/categories.schema";

export function categoriesStoreApi(): UseMutation<
    CategoriesStoreAPI,
    CategoriesStoreDto,
    CategoriesStoreErrorAPI
> {
    return useMutation("/categories", async (url, body) => {
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
export interface CategoriesStoreErrorAPI {
    body: keyof CategoriesStoreDto;
    message: string;
    success: false;
}

export interface CategoriesStoreAPI {
    success: boolean;
    category: CategoriesSchemaFromServer;
}

export interface Image {
    dimension: number;
    file: string;
}
