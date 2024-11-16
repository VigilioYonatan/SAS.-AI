import { useMutation } from "@vigilio/preact-fetching";
import type {
    NewStoreDto,
    NewUpdateImageDto,
} from "@/empresas/dtos/new.store.dto";
import { ResultApiImages, uploadApi } from "~/libs/upload";
import { storeUploadImagesNew } from "./new.store.api";

export function webUpdateApi(id: number) {
    return useMutation<NewUpdateAPI, NewStoreDto, NewUpdateErrorAPI>(
        `/new/${id}`,
        async (url, body) => {
            const response = await fetch(`/api${url}`, {
                method: "PUT",
                body: JSON.stringify(body),
                headers: {
                    "Content-type": "application/json",
                },
            });
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        }
    );
}
export function newUpdateImagesApi(slug: string | number) {
    return useMutation<
        ResultApiImages,
        NewUpdateImageDto,
        { success: false; message: string }
    >(`${storeUploadImagesNew}/${slug}`, async (url, body) => {
        const result = await uploadApi(`/api${url}`, {
            file: body.image,
        });
        return result;
    });
}
export interface NewUpdateAPI {
    success: boolean;
    message: string;
}

export interface NewUpdateErrorAPI {
    success: boolean;
    body: keyof NewStoreDto;
    message: string;
}
