import { type UseMutation, useMutation } from "@vigilio/preact-fetching";

export type CartDestroyMutation = UseMutation<
    CartDestroyAPI,
    { product_id: number; variant_id: number | null },
    CartDestroyErrorAPI
>;
export function cartDestroyApi(): CartDestroyMutation {
    return useMutation(
        "/cart",
        async (
            url,
            body: { product_id: number; variant_id: number | null }
        ) => {
            const response = await fetch(
                `/api${url}/${body.product_id}/variants/${body.variant_id}`,
                {
                    method: "DELETE",
                }
            );
            const result = await response.json();

            if (!result.success) throw result;
            return result;
        }
    );
}

export interface CartDestroyErrorAPI {
    success: boolean;
    message: string;
}
export interface CartDestroyAPI {
    success: boolean;
    message: string;
}
