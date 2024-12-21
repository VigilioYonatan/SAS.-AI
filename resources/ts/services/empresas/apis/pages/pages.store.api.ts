import { PagesStoreDto } from "@/empresas/dtos/pages.store.dto";
import { PageSchema } from "@/empresas/schemas/pages.schema";
import { useMutation, type UseMutation } from "@vigilio/preact-fetching";
export function pageStoreApi(): UseMutation<
    PageStoreApi,
    PagesStoreDto,
    PageStoreApiError
> {
    return useMutation("/pages", async (url, body) => {
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
interface PageStoreApi {
    success: true;
    message: string;
}
interface PageStoreApiError {
    success: true;
    message: string;
    body: keyof PageSchema;
}
