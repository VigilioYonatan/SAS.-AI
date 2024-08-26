import enviroments from "~/config";
import { type UseMutation, useMutation } from "@vigilio/preact-fetching";
import { type CategoriesUpdateDto } from "../../dtos/categories.update.dto";
import type { CategoriesSchemaFromServer } from "../../schemas/categories.schema";

export function categoriesUpdateApi(
    slug: number | string
): UseMutation<
    CategoriesUpdateAPI,
    CategoriesUpdateDto,
    categoriesUpdateErrorAPI
> {
    return useMutation(`/categories/${slug}`, async (url, body) => {
        const response = await fetch(`${enviroments.VITE_URL}/api${url}`, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: {
                "content-type": "application/json",
            },
        });
        const result = await response.json();
        if (!result.success) throw result;
        return result;
    });
}

export interface CategoriesUpdateAPI {
    success: boolean;
    category: CategoriesSchemaFromServer;
}
export interface categoriesUpdateErrorAPI {
    success: boolean;
    message: string;
    body: keyof CategoriesUpdateDto;
}
