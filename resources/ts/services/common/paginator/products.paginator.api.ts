import { useQuery } from "@vigilio/preact-fetching";
import enviroments from "~/config";
import type { ProductsSchemaFromServer } from "@/products/schemas/products.schema";
import type { UseTable } from "@vigilio/preact-table";
import type { ProductsIndexSecondaryPaginator } from "@/products/libs/ProductsColumns";
import type { Signal } from "@preact/signals";

export function productsPaginatorApi(
    table: UseTable<ProductsSchemaFromServer, ProductsIndexSecondaryPaginator>,
    props: Signal<{
        family: string | null;
        category: string | null;
        subcategory: string | null;
    }>
) {
    const result = useQuery<ProductsPaginatorAPI, ProductsPaginatorAPIError>(
        "/paginator/products",
        async (url) => {
            const data = new URLSearchParams();
            data.append("offset", String(table.pagination.value.offset));
            data.append("limit", String(table.pagination.value.limit));
            data.append("search", String(table.search.value));

            if (props.value.category) {
                data.append("categoria", props.value.category);
            }

            if (!Object.keys(table.sort.value).length) {
                data.append("id", "DESC");
            }
            for (const [key, value] of Object.entries(table.sort.value)) {
                data.append(key, value as string);
            }
            const response = await fetch(`/api${url}?${data}`);
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        },
        {
            onSuccess(data) {
                table.updateData({
                    count: data.count,
                    result: data.results,
                });
            },
        }
    );
    return result;
}
export interface ProductsPaginatorAPI {
    success: true;
    results: ProductsSchemaFromServer[];
    count: number;
    next: string | null;
    previous: string | null;
}
export interface ProductsPaginatorAPIError {
    success: false;
    message: string;
    params: string;
}
