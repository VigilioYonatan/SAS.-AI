import type { NewStoreDto } from "@/empresas/dtos/new.store.dto";
import type { NewSchema } from "@/empresas/schemas/new.schema";
import { useMutation, type UseMutation } from "@vigilio/preact-fetching";
import { uploadApi } from "~/libs/upload";
export const storeUploadImagesNew = "/uploads/new/image";
export function newStoreApi(): UseMutation<
    NewStoreApi,
    NewStoreDto,
    NewStoreApiError
> {
    return useMutation("/new", async (url, body) => {
        let image = null;
        if (body.image) {
            const result = await uploadApi(`/api${storeUploadImagesNew}`, {
                file: body.image,
            });
            image = result.files;
        }
        const response = await fetch(`/api${url}`, {
            method: "POST",
            body: JSON.stringify({ ...body, image }),
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
