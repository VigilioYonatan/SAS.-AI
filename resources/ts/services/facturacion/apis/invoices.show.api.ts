import { useQuery } from "@vigilio/preact-fetching";
import type { ProductsSchemaFromServer } from "@/products/schemas/products.schema";
import type { UseTable } from "@vigilio/preact-table";
import type { ProductsIndexSecondaryPaginator } from "@/products/libs/ProductsColumns";

export function invoicesShowApi(
    table: UseTable<ProductsSchemaFromServer, ProductsIndexSecondaryPaginator>,
    slug: string
) {
    const result = useQuery<invoicesShowAPI, invoicesShowAPIError>(
        `/invoices/${slug}`,
        async (url) => {
            const data = new URLSearchParams();
            data.append("offset", String(table.pagination.value.offset));
            data.append("limit", String(table.pagination.value.limit));

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
export interface invoicesShowAPI {
    success: true;
    results: ProductsSchemaFromServer[];
    count: number;
    next: string | null;
    previous: string | null;
}
export interface invoicesShowAPIError {
    success: false;
    message: string;
    params: string;
}
