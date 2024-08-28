import {
    type UseQuery,
    useQuery,
    type OptionsQuery,
} from "@vigilio/preact-fetching";
import type { FeaturesSchema } from "@/products/schemas/options/features.schema";
export type OptionsFeaturesShowApiMethod = UseQuery<
    OptionsOptionValuesAPI,
    OptionsOptionValuesErrorAPI
>;

export function optionsFeaturesShowApi(
    id: number,
    options?: OptionsQuery<OptionsOptionValuesAPI, OptionsOptionValuesErrorAPI>
): OptionsFeaturesShowApiMethod {
    return useQuery(
        `/options/${id}`,
        async (url) => {
            const response = await fetch(`/api${url}/features`);
            const result: OptionsOptionValuesAPI = await response.json();
            if (!result.success) throw result;
            return result;
        },
        options
    );
}

export interface OptionsOptionValuesAPI {
    success: boolean;
    data: FeaturesSchema[];
}
export interface OptionsOptionValuesErrorAPI {
    success: boolean;
    message: string;
}
