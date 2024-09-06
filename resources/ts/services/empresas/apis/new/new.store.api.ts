import type { NewStoreDto } from "@/empresas/dtos/new.store.dto";
import type { NewSchema } from "@/empresas/schemas/new.schema";
import { useMutation, type UseMutation } from "@vigilio/preact-fetching";

export function newStoreApi(): UseMutation<
    NewStoreApi,
    NewStoreDto,
    NewStoreApiError
> {
    return useMutation("/new", async (url, body) => {
        const response = await fetch(`/api${url}`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "content-type": "application/json",
            },
        });
        const result = await response.json();
        if (!result.success) throw result;
        return result;
    });
}
interface NewStoreApi {
    success: true;
    message: string;
}
interface NewStoreApiError {
    success: true;
    message: string;
    body: keyof NewSchema;
}
