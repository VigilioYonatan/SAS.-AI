import { CrudSchema } from "@/empresas/schemas/crud.schema";
import { useQuery } from "@vigilio/preact-fetching";

export function crudIndexApi() {
    return useQuery("/crud", async (url) => {
        const response = await fetch(`/api${url}`);
        const result: CrudIndexAPI = await response.json();
        if (!result.success) throw result;
        return result;
    });
}

export interface CrudIndexAPI {
    success: boolean;
    data: CrudSchema[];
}
