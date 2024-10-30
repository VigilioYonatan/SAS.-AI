import { ProductsUpdateImagesDto } from "@/products/dtos/products_normal.dto";
import { useMutation } from "@vigilio/preact-fetching";
import { uploadApi, type ResultApiImages } from "~/libs/upload";
import { storeUploadImages } from "./products_normal.store.api";
import { ProductsServicioUpdateDto } from "@/products/dtos/products_servicio.dto";
import { ProductsServicioSchemaFromServer } from "@/products/schemas/products_servicio.schema";

export function productsServicioUpdateApi(slug: string | number) {
    return useMutation<
        ProductsServicioUpdateAPI,
        ProductsServicioUpdateDto,
        ProductsServicioUpdateErrorAPI
    >(`/products/${slug}`, async (url, body) => {
        const response = await fetch(`/api${url}/servicio`, {
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
export function servicioUpdateImagesApi(slug: string | number) {
    return useMutation<
        ResultApiImages,
        ProductsUpdateImagesDto & { name: string },
        ProductsServicioUpdateErrorAPI
    >(`${storeUploadImages}/${slug}`, async (url, body) => {
        const result = await uploadApi(`/api${url}?type=service`, {
            name: body.name,
            file: body.images,
        });
        return result;
    });
}
export interface ProductsServicioUpdateImagesAPI {
    success: boolean;
    message: string;
}

export interface ProductsServicioUpdateAPI {
    success: boolean;
    product: ProductsServicioSchemaFromServer;
}
export interface ProductsServicioUpdateErrorAPI {
    success: boolean;
    message: string;
    body: string;
}
