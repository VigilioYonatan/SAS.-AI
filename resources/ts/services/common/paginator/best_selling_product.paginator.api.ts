import { useQuery } from "@vigilio/preact-fetching";
import type { Signal } from "@preact/signals";
import type { ProductsSchemaFromServer } from "@/products/schemas/products.schema";
import type { UsePaginator } from "@vigilio/preact-paginator";

export function bestSellingProductPaginatorApi(
    paginator: UsePaginator,
    props: Signal<{
        family: string | null;
        category: string | null;
        subcategory: string | null;
    }>,
    query: [string, string][] | null = null
) {
    const result = useQuery<
        BestSellingProductPaginatorAPI,
        BestSellingProductPaginatorAPIError
    >(
        "/paginator/products",
        async (url) => {
            const data = new URLSearchParams();
            data.append("offset", String(paginator.pagination.value.offset));
            data.append("limit", String(paginator.pagination.value.limit));
            data.append("search", String(paginator.search.value));
            if (props.value.family) {
                data.append("familia", props.value.family);
            }
            if (props.value.category) {
                data.append("categoria", props.value.category);
            }
            if (props.value.subcategory) {
                data.append("subcategoria", props.value.subcategory);
            }

            if (query) {
                for (const [key, value] of query) {
                    data.append(key, value);
                }
            }

            const response = await fetch(`/api${url}?${data}`);
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        },
        {
            onSuccess(data) {
                paginator.updateData({
                    total: data.count,
                });
            },
        }
    );
    return result;
}
export interface BestSellingProductPaginatorAPI {
    success: true;
    results: ProductsSchemaFromServer[];
    count: number;
    next: string | null;
    previous: string | null;
}
export interface BestSellingProductPaginatorAPIError {
    success: false;
    message: string;
    params: string;
}
