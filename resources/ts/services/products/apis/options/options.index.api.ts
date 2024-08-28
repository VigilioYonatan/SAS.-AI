import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import type { OptionsSchema } from "@/products/schemas/options/options.schema";
export type OptionsIndexApiMethod = UseQuery<OptionsIndexAPI, unknown>;

export function optionsIndexApi(): OptionsIndexApiMethod {
    return useQuery("/options", async (url) => {
        const response = await fetch(`/api${url}`);
        const result: OptionsIndexAPI = await response.json();
        if (!result.success) throw result;
        return result;
    });
}

export interface OptionsIndexAPI {
    success: boolean;
    data: OptionsSchema[];
}
