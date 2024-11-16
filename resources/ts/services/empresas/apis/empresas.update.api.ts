import { type UseMutation, useMutation } from "@vigilio/preact-fetching";
import {
    EmpresasIconUpdateDto,
    EmpresasLogoPWAUpdateDto,
    EmpresasLogoUpdateDto,
    EmpresasPhotoUpdateDto,
} from "../dtos/empresas.update.dto";
import { ResultApiImages, uploadApi } from "~/libs/upload";
import { EmpresasUpdateDto } from "../dtos/empresas.update.dto";
import { EmpresasSchemaFromServer } from "../schemas/empresas.schema";

export function empresaUpdateApi(): UseMutation<
    empresaUpdateAPI,
    EmpresasUpdateDto,
    empresaUpdateErrorAPI
> {
    return useMutation("/empresas", async (url, body) => {
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
export function empresaUpdateLogoApi() {
    return useMutation<
        ResultApiImages,
        EmpresasLogoUpdateDto & { name: string },
        { success: false; message: string; body: keyof EmpresasLogoUpdateDto }
    >("/uploads/empresas/logo/1", async (url, body) => {
        const result = await uploadApi(`/api${url}`, {
            file: body.logo,
            name: body.name,
        });

        return result;
    });
}
export function empresaUpdateLogoPWAApi() {
    return useMutation<
        ResultApiImages,
        EmpresasLogoPWAUpdateDto & { name: string },
        {
            success: false;
            message: string;
            body: keyof EmpresasLogoPWAUpdateDto;
        }
    >("/uploads/empresas/logo_pwa/1", async (url, body) => {
        const result = await uploadApi(`/api${url}`, {
            file: body.logo_pwa,
            name: body.name,
        });
        return result;
    });
}
export function empresasUpdateIconApi() {
    return useMutation<
        ResultApiImages,
        EmpresasIconUpdateDto & { name: string },
        { success: false; message: string; body: keyof EmpresasIconUpdateDto }
    >("/uploads/empresas/icon/1", async (url, body) => {
        const result = await uploadApi(`/api${url}`, {
            file: body.icon,
            name: body.name,
        });
        return result;
    });
}
export function empresasUpdatePhotoApi() {
    return useMutation<
        ResultApiImages,
        EmpresasPhotoUpdateDto & { name: string },
        { success: false; message: string; body: keyof EmpresasPhotoUpdateDto }
    >("/uploads/empresas/photo/1", async (url, body) => {
        const result = await uploadApi(`/api${url}`, {
            file: body.photo,
            name: body.name,
        });
        return result;
    });
}
interface empresaUpdateAPI {
    success: boolean;
    empresa: EmpresasSchemaFromServer;
}

interface empresaUpdateErrorAPI {
    success: false;
    message: string;
    body: keyof EmpresasUpdateDto;
}
