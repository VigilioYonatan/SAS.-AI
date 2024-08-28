import { useMutation } from "@vigilio/preact-fetching";

export function variantsDeleteApi(product_id: number) {
    return useMutation<
        VariantsOptionValuesAPI,
        number,
        VariantsOptionValuesErrorAPI
    >(`/products/${product_id}/variants`, async (url, variant_id) => {
        const response = await fetch(`/api${url}/${variant_id}`, {
            method: "DELETE",
        });
        const result: VariantsOptionValuesAPI = await response.json();
        if (!result.success) throw result;
        return result;
    });
}

export interface VariantsOptionValuesAPI {
    success: boolean;
    message: string;
}
export interface VariantsOptionValuesErrorAPI {
    success: boolean;
    message: string;
}
