import { PagesStoreDto } from "@/empresas/dtos/pages.store.dto";
import { PageSchema } from "@/empresas/schemas/pages.schema";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
import { useMutation, type UseMutation } from "@vigilio/preact-fetching";
import { uploadApi } from "~/libs/upload";

export const pagesStoreUploadFavicon = "/uploads/pages/favicon";
export const pagesStoreUploadOGGFavicon = "/uploads/pages/ogg_favicon";

export function pageStoreApi(): UseMutation<
    PageStoreApi,
    PagesStoreDto,
    PageStoreApiError
> {
    return useMutation("/pages", async (url, body) => {
        let favicon = null;
        let oggFavicon = null;
        if (body.favicon) {
            const result = await uploadApi(`/api${pagesStoreUploadFavicon}`, {
                file: body.favicon,
                name: storageEmpresa?.name_empresa,
            });
            favicon = result.files;
        }
        if (body.ogg_favicon) {
            const result = await uploadApi(
                `/api${pagesStoreUploadOGGFavicon}`,
                {
                    file: body.favicon,
                    name: storageEmpresa?.name_empresa,
                }
            );
            oggFavicon = result.files;
        }

        const response = await fetch(`/api${url}`, {
            method: "POST",
            body: JSON.stringify({ ...body, favicon, ogg_favicon: oggFavicon }),
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
