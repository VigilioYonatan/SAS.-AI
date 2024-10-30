import { type UseMutation, useMutation } from "@vigilio/preact-fetching";

export type CartDestroyMutation = UseMutation<
    CartDestroyAPI,
    {
        product_normal_id: number | null;
        product_restaurant_id: number | null;
        variant_id: number | null;
    },
    CartDestroyErrorAPI
>;
export function cartDestroyApi(): CartDestroyMutation {
    return useMutation("/cart", async (url, body) => {
        const query = new URLSearchParams();
        if (body.variant_id) {
            query.append("variant_id", String(body.variant_id));
        }
        const response = await fetch(
            `/api${url}/${
                body.product_normal_id ?? body.product_restaurant_id
            }?${query}`,
            {
                method: "DELETE",
            }
        );
        const result = await response.json();

        if (!result.success) throw result;
        return result;
    });
}

export interface CartDestroyErrorAPI {
    success: boolean;
    message: string;
}
export interface CartDestroyAPI {
    success: boolean;
    message: string;
}
