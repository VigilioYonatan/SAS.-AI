import type { OptionsStoreDto } from "@/products/dtos/options/options.store.dto";
import type { OptionsSchema } from "@/products/schemas/options/options.schema";
import { useMutation } from "@vigilio/preact-fetching";

export function optionsStoreApi() {
    return useMutation<OptionsStoreAPI, OptionsStoreDto, OptionsStoreErrorAPI>(
        "/options",
        async (url, body) => {
            const response = await fetch(`/api${url}`, {
                body: JSON.stringify(body),
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
            });
            const result = await response.json();

            if (!result.success) throw result;
            return result;
        }
    );
}

export interface OptionsStoreAPI {
    success: boolean;
    option: OptionsSchema;
}

export interface OptionsStoreErrorAPI {
    success: boolean;
    message: string;
    body: string;
}
