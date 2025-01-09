import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import { CrudSchema } from "@/empresas/schemas/crud.schema";

export function crudShowApi(
    id: number | string
): UseQuery<BackupShowAPI, BackupShowErrorAPI> {
    return useQuery<BackupShowAPI, BackupShowErrorAPI>(
        `/crud/${id}`,
        async (url) => {
            const response = await fetch(`/api${url}`);
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        },
        { clean: true }
    );
}

export interface BackupShowAPI {
    success: boolean;
    crud: CrudSchema;
}

export interface BackupShowErrorAPI {
    success: boolean;
    message: string;
}
