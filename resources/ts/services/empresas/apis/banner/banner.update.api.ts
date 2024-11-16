import { useMutation } from "@vigilio/preact-fetching";
import type { BannerStoreDto } from "@/empresas/dtos/banner.store.dto";
import { ResultApiImages, uploadApi } from "~/libs/upload";
import {
    BannerUpdateDto,
    BannerUpdateFileDto,
} from "@/empresas/dtos/banner.update.dto";
import { storeUploadFleBanner } from "./banner.store.api";

export function bannerUpdateApi(id: number) {
    return useMutation<BannerUpdateAPI, BannerUpdateDto, BannerUpdateErrorAPI>(
        `/banner/${id}`,
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
export function bannerUpdatFileApi(slug: string | number) {
    return useMutation<
        ResultApiImages,
        BannerUpdateFileDto,
        { success: false; message: string }
    >(`${storeUploadFleBanner}/${slug}`, async (url, body) => {
        const result = await uploadApi(`/api${url}`, {
            file: body.file,
        });
        return result;
    });
}
export interface BannerUpdateAPI {
    success: boolean;
    message: string;
}

export interface BannerUpdateErrorAPI {
    success: boolean;
    body: keyof BannerStoreDto;
    message: string;
}
