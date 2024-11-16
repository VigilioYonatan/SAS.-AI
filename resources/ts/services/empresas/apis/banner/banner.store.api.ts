import { BannerStoreDto } from "@/empresas/dtos/banner.store.dto";
import type { BannerSchema } from "@/empresas/schemas/banner.schema";
import { useMutation, type UseMutation } from "@vigilio/preact-fetching";
import { uploadApi } from "~/libs/upload";
export const storeUploadFleBanner = "/uploads/banner/file";
export function bannerStoreApi(): UseMutation<
    BannerStoreApi,
    BannerStoreDto,
    BannerStoreApiError
> {
    return useMutation("/banner", async (url, body) => {
        const { files } = await uploadApi(`/api${storeUploadFleBanner}`, {
            file: body.file,
        });
        const file = files;
        const response = await fetch(`/api${url}`, {
            method: "POST",
            body: JSON.stringify({ ...body, file }),
            headers: {
                "content-type": "application/json",
            },
        });
        const result = await response.json();
        if (!result.success) throw result;
        return result;
    });
}
interface BannerStoreApi {
    success: true;
    message: string;
}
interface BannerStoreApiError {
    success: true;
    message: string;
    body: keyof BannerSchema;
}
