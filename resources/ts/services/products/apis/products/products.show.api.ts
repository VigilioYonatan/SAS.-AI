import { ProductsNormalSchemaFromServer } from "@/products/schemas/products_normal.schema";
import { ProductsRestaurantSchemaFromServer } from "@/products/schemas/products_restaurant.schema";
import { ProductsServicioSchemaFromServer } from "@/products/schemas/products_servicio.schema";
import { type UseQuery, useQuery } from "@vigilio/preact-fetching";

export function productsShowApi(
    slug: number | string,
    isService: boolean
): UseQuery<ProductsShowAPI, ProductsShowErrorAPI> {
    return useQuery<ProductsShowAPI, ProductsShowErrorAPI>(
        `/products/${slug}${isService ? "?type=service" : ""}`,
        productShowFetch
    );
}
export async function productShowFetch(url: string) {
    const response = await fetch(`/api${url}`);
    const result: ProductsShowAPI = await response.json();
    if (!result.success) throw result;
    return result;
}

export interface ProductsShowAPI {
    success: boolean;
    product:
        | ProductsNormalSchemaFromServer
        | ProductsRestaurantSchemaFromServer
        | ProductsServicioSchemaFromServer;
}

export interface ProductsShowErrorAPI {
    success: boolean;
    message: string;
}
