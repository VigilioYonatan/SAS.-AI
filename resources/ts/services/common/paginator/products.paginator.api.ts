import { useQuery } from "@vigilio/preact-fetching";
import type { UseTable } from "@vigilio/preact-table";
import type { ProductsIndexSecondaryPaginator } from "@/products/libs/ProductsColumns";
import type { Signal } from "@preact/signals";
import { ProductsNormalSchemaFromServer } from "@/products/schemas/products_normal.schema";
import { ProductsRestaurantSchemaFromServer } from "@/products/schemas/products_restaurant.schema";
import { ProductsServicioSchemaFromServer } from "@/products/schemas/products_servicio.schema";

export function productsPaginatorApi(
    table: UseTable<
        | ProductsNormalSchemaFromServer
        | ProductsRestaurantSchemaFromServer
        | ProductsServicioSchemaFromServer,
        ProductsIndexSecondaryPaginator
    >,
    props: Signal<{
        category: string | null;
    }>,
    isService: boolean
) {
    const result = useQuery<ProductsPaginatorAPI, ProductsPaginatorAPIError>(
        "/paginator/products",
        async (url) => {
            const data = new URLSearchParams();
            if (isService) {
                data.append("type", "service");
            }
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
                    result: data.results as
                        | ProductsNormalSchemaFromServer[]
                        | ProductsNormalSchemaFromServer[],
                });
            },
        }
    );
    return result;
}
export interface ProductsPaginatorAPI {
    success: true;
    results:
        | ProductsNormalSchemaFromServer[]
        | ProductsRestaurantSchemaFromServer[];
    count: number;
    next: string | null;
    previous: string | null;
}
export interface ProductsPaginatorAPIError {
    success: false;
    message: string;
    params: string;
}
