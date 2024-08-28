import enviroments from "~/config";
import { useQuery } from "@vigilio/preact-fetching";
import type { DistrictsSchemaFromServer } from "../schemas/districts.schema";

export function districtsIndexApi() {
    return useQuery<DistrictsIndexAPI, unknown>(
        "/ubigeo/districts",
        async (url) => {
            const response = await fetch(`/${url}`);
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        }
    );
}

export interface DistrictsIndexAPI {
    success: boolean;
    data: DistrictsSchemaFromServer[];
}
