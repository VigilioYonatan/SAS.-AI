import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import { FinanzasSchemaFromServer } from "../schemas/finanzas.schema";

export function finanzasShowApi(
    code: number | string
): UseQuery<FinanzasShowAPI, FinanzasShowErrorAPI> {
    return useQuery<FinanzasShowAPI, FinanzasShowErrorAPI>(
        `/finanzas/${code}`,
        async (url) => {
            const response = await fetch(`/api${url}`);
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        }
    );
}

export interface FinanzasShowAPI {
    success: boolean;
    finanza: FinanzasSchemaFromServer;
}

export interface FinanzasShowErrorAPI {
    success: boolean;
    message: string;
}
