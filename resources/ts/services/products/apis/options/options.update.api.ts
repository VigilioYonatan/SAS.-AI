import type { FeaturesStoreDto } from "@/products/dtos/options/features.store.dto";
import { useMutation } from "@vigilio/preact-fetching";

export function optionsUpdateApi() {
    return useMutation<
        OptionsUpdateAPI,
        FeaturesStoreDto & { id: number },
        OptionsUpdateErrorAPI
    >("/options", async (url, body) => {
        const { id, ...rest } = body;
        const response = await fetch(`/api${url}/${id}`, {
            body: JSON.stringify(rest),
            method: "PUT",
            headers: {
                "content-type": "application/json",
            },
        });
        const result = await response.json();

        if (!result.success) throw result;
        return result;
    });
}

export interface OptionsUpdateAPI {
    success: boolean;
    message: string;
}

export interface OptionsUpdateErrorAPI {
    success: boolean;
    message: string;
    body: string;
}
