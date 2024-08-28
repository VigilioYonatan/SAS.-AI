import {
    ProductsNormalUpdateDto,
    ProductsUpdateImagesDto,
} from "@/products/dtos/products_normal.dto";
import { useMutation } from "@vigilio/preact-fetching";
import { uploadApi, type ResultApiImages } from "~/libs/upload";
import { storeUploadImages } from "./products_normal.store.api";
import { ProductsNormalSchemaFromServer } from "@/products/schemas/products_normal.schema";

export function productsNormalUpdateApi(slug: string | number) {
    return useMutation<
        ProductsNormalUpdateAPI,
        ProductsNormalUpdateDto,
        ProductsNormalUpdateErrorAPI
    >(`/productsNormal/${slug}`, async (url, body) => {
        const response = await fetch(`/api${url}`, {
            method: "PUT",
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
export function productsUpdateImagesApi(slug: string | number) {
    return useMutation<
        ResultApiImages,
        ProductsUpdateImagesDto & { name: string },
        ProductsNormalUpdateErrorAPI
    >(`${storeUploadImages}/${slug}`, async (url, body) => {
        const result = await uploadApi(`/api${url}`, {
            name: body.name,
            file: body.images,
        });
        return result;
    });
}
export interface ProductsNormalUpdateImagesAPI {
    success: boolean;
    message: string;
}

export interface ProductsNormalUpdateAPI {
    success: boolean;
    product: ProductsNormalSchemaFromServer;
}
export interface ProductsNormalUpdateErrorAPI {
    success: boolean;
    message: string;
    body: string;
}
