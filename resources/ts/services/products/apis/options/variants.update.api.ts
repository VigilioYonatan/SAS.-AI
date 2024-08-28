import { useMutation } from "@vigilio/preact-fetching";
import type { VariantsUpdateDto } from "@/products/dtos/options/variants.update.dto";

export function variantsUpdateApi(product_id: number, variant_id: number) {
    return useMutation<
        VariantsOptionValuesAPI,
        VariantsUpdateDto,
        VariantsOptionValuesErrorAPI
    >(`/products/${product_id}/variants/${variant_id}`, async (url, body) => {
        const response = await fetch(`/api${url}`, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: {
                "content-type": "application/json",
            },
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
    body: keyof VariantsUpdateDto;
}
