import { useQuery } from "@vigilio/preact-fetching";
import { RegionsSchemaFromServer } from "../schemas/regions.schema";

export function regionsIndexApi() {
    return useQuery<RegionsIndexAPI, unknown>(
        "/ubigeo/regions",
        async (url) => {
            const response = await fetch(`/api${url}`);
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        },
        {
            isCaching: 12 * 60 * 1000 * 60,
        }
    );
}

export interface RegionsIndexAPI {
    success: boolean;
    data: RegionsSchemaFromServer[];
}
