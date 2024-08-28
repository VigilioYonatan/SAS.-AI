import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import { type BrandsSchemaFromServer } from "../../schemas/brands.schema";

export function brandsShowApi(
    slug: number | string
): UseQuery<BrandsShowAPI, BrandsShowErrorAPI> {
    return useQuery(`/brands/${slug}`, async (url) => {
        const response = await fetch(`/api${url}`);
        const result = await response.json();
        if (!result.success) throw result;
        return result;
    });
}

export interface BrandsShowAPI {
    success: boolean;
    brand: BrandsSchemaFromServer;
}

export interface BrandsShowErrorAPI {
    success: boolean;
    message: string;
}
