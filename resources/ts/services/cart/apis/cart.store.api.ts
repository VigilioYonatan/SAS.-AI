import { type UseMutation, useMutation } from "@vigilio/preact-fetching";
import type { CartStoreDto } from "../dtos/cart.store.dto";
import type { CartSchema } from "../schemas";

export function cartStoreApi(): UseMutation<
    CartStoreAPI,
    CartStoreDto,
    CartStoreErrorAPI
> {
    return useMutation("/cart", async (url, body) => {
        const response = await fetch(`/api${url}`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-type": "application/json",
            },
        });
        const result = await response.json();
        if (!result.success) throw result;
        return result;
    });
}
export interface CartStoreErrorAPI {
    body: keyof CartStoreDto;
    message: string;
    success: false;
}

export interface CartStoreAPI {
    success: boolean;
    cart: CartSchema;
}
