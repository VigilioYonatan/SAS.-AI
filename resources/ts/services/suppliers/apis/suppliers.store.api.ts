import { useMutation } from "@vigilio/preact-fetching";
import type { SuppliersSchemaFromServer } from "../schemas/suppliers.schema";
import type { SuppliersStoreDto } from "../dtos/suppliers.store.dto";
import { uploadApi } from "~/libs/upload";

export const SuppliersstoreUploadLogo = "/uploads/suppliers/logo";

export function suppliersStoreApi() {
    return useMutation<
        SuppliersStoreAPI,
        SuppliersStoreDto,
        SuppliersStoreErrorAPI
    >("/suppliers", async (url, body) => {
        let logo = null;
        if (body.logo) {
            const files = await uploadApi(`/api${SuppliersstoreUploadLogo}`, {
                name: body.razon_social,
                file: body.logo,
            });
            logo = files.files;
        }

        const response = await fetch(`/${url}`, {
            body: JSON.stringify({ ...body, logo }),
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
        });
        const result = await response.json();
        if (!result.success) throw result;
        return result;
    });
}

export interface SuppliersStoreAPI {
    success: boolean;
    supplier: SuppliersSchemaFromServer;
}

export interface SuppliersStoreErrorAPI {
    success: boolean;
    message: string;
    body: string;
}
