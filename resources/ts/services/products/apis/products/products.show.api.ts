import { ProductsNormalSchemaFromServer } from "@/products/schemas/products_normal.schema";
import { ProductsRestaurantSchemaFromServer } from "@/products/schemas/products_restaurant.schema";
import { ProductsServicioSchemaFromServer } from "@/products/schemas/products_servicio.schema";
import { type UseQuery, useQuery } from "@vigilio/preact-fetching";

export function productsShowApi(
    slug: number | string,
    isService: boolean,
    isCart = false
): UseQuery<ProductsShowAPI, ProductsShowErrorAPI> {
    return useQuery<ProductsShowAPI, ProductsShowErrorAPI>(
        `/products/${slug}${isService ? "?type=service" : ""}`,
        (url) => productShowFetch(url, isCart)
    );
}
export async function productShowFetch(url: string, isCart = false) {
    const EXPIRATION_TIME = 15 * 60 * 1000;

    let result = JSON.parse(localStorage.getItem(url) ?? "null");

    if (!result || Date.now() - result.timestamp > EXPIRATION_TIME || isCart) {
        const response = await fetch(`/api${url}`);
        result = await response.json();
        if (!result.success) throw result;
        const { description, ...rest } = result.product;
        localStorage.setItem(
            url,
            JSON.stringify({
                timestamp: Date.now(),
                data: {
                    success: true,
                    product: rest,
                },
            })
        );

        return result;
    }
    // If cache is still valid, return cached data
    return result.data;
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
