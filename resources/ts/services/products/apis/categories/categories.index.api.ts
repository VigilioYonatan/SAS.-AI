import {
    type UseQuery,
    useQuery,
    type OptionsQuery,
} from "@vigilio/preact-fetching";
import type { CategoriesSchemaFromServer } from "../../schemas/categories.schema";

export type CategoriesIndexApiMethod = UseQuery<CategoriesIndexAPI, unknown>;

export function categoriesIndexApi(
    isService: boolean,
    options?: OptionsQuery<CategoriesIndexAPI, unknown>
): CategoriesIndexApiMethod {
    return useQuery(
        "/categories",
        async (url) => {
            const data = new URLSearchParams();
            if (isService) {
                data.append("type", "service");
            }
            const response = await fetch(`/api${url}?${data}`);
            const result: CategoriesIndexAPI = await response.json();
            if (!result.success) throw result;
            return result;
        },
        options
    );
}

export interface CategoriesIndexAPI {
    success: boolean;
    data: CategoriesSchemaFromServer[];
}
