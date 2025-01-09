import { CrudStoreDto } from "@/empresas/dtos/crud.store.dto";
import { CrudSchema } from "@/empresas/schemas/crud.schema";
import { useMutation, type UseMutation } from "@vigilio/preact-fetching";
export function crudStoreApi(): UseMutation<
    CrudStoreApi,
    CrudStoreDto,
    CrudStoreApiError
> {
    return useMutation("/crud", async (url, body) => {
        const response = await fetch(`/api${url}`, {
            method: "POST",
            body: JSON.stringify({ ...body }),
            headers: {
                "content-type": "application/json",
            },
        });
        const result = await response.json();
        if (!result.success) throw result;
        return result;
    });
}
interface CrudStoreApi {
    success: true;
    message: string;
}
interface CrudStoreApiError {
    success: true;
    message: string;
    body: keyof CrudSchema;
}
