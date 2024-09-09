import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import { EmpresasSchemaFromServer } from "../schemas/empresas.schema";

export function empresaShowApi(
    id: number | string,
    skip = true
): UseQuery<empresaShowAPI, empresaShowErrorAPI> {
    return useQuery(
        `/empresas/${id}`,
        async (url) => {
            const response = await fetch(`/api${url}`);
            const result: empresaShowAPI = await response.json();
            if (!result.success) throw result;
            return result;
        },
        { skipFetching: skip }
    );
}

export interface empresaShowAPI {
    success: boolean;
    empresa: EmpresasSchemaFromServer;
}

export interface empresaShowErrorAPI {
    success: boolean;
    message: string;
}
