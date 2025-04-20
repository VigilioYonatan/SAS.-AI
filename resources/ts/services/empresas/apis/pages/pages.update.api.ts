import {
    PagesUpdateDto,
    PagesUpdateFaviconDto,
    PagesUpdateOGGFaviconDto,
} from "@/empresas/dtos/pages.update.dto";
import { useMutation } from "@vigilio/preact-fetching";
import { ResultApiImages, uploadApi } from "~/libs/upload";
import {
    pagesStoreUploadFavicon,
    pagesStoreUploadOGGFavicon,
} from "./pages.store.api";
import { storageEmpresa } from "@/empresas/stores/empresa.store";

export function pageUpdateApi(id: number) {
    return useMutation<PageUpdateAPI, PagesUpdateDto, PageUpdateErrorAPI>(
        `/pages/${id}`,
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

export interface PageUpdateAPI {
    success: boolean;
    message: string;
}

export interface PageUpdateErrorAPI {
    success: boolean;
    body: keyof PagesUpdateDto;
    message: string;
}

export function pageUpdateFaviconApi(slug: string | number) {
    return useMutation<
        ResultApiImages,
        PagesUpdateFaviconDto,
        PageUpdateErrorAPI
    >(`${pagesStoreUploadFavicon}/${slug}`, async (url, body) => {
        const result = await uploadApi(`/api${url}`, {
            file: body.favicon,
            name: storageEmpresa?.name_empresa,
        });
        return result;
    });
}
export interface ProductsNormalUpdateImagesAPI {
    success: boolean;
    message: string;
}
//
export function pageUpdateOGGFaviconApi(slug: string | number) {
    return useMutation<
        ResultApiImages,
        PagesUpdateOGGFaviconDto,
        PageUpdateErrorAPI
    >(`${pagesStoreUploadOGGFavicon}/${slug}`, async (url, body) => {
        const result = await uploadApi(`/api${url}`, {
            file: body.ogg_favicon,
            name: storageEmpresa?.name_empresa,
        });
        return result;
    });
}
export interface ProductsNormalUpdateImagesAPI {
    success: boolean;
    message: string;
}
