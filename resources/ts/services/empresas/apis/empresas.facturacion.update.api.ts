import { useMutation, type UseMutation } from "@vigilio/preact-fetching";
import { uploadApi, type ResultApiImages } from "~/libs/upload";
import {
    EmpresasFacturacionCertificadoUpdateDto,
    EmpresasFacturacionUpdateDto,
} from "../dtos/empresas.facturacion.update.dto";
import { EmpresasSchema } from "../schemas/empresas.schema";
export const uploadempresaFacturacionUpdateApi = "/uploads/empresa/certificado";

export function empresaFacturacionUpdateApi(): UseMutation<
    empresaFacturacionUpdateApi,
    EmpresasFacturacionUpdateDto,
    empresaFacturacionUpdateApi
> {
    return useMutation("/empresas/company", async (url, body) => {
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
export function empresaFacturacionCertificadoUpdateApi(): UseMutation<
    ResultApiImages,
    EmpresasFacturacionCertificadoUpdateDto,
    empresaFacturacionUpdateApi
> {
    return useMutation(uploadempresaFacturacionUpdateApi, async (url, body) => {
        const result = await uploadApi(`/api${url}/1`, {
            file: body.certificado,
        });
        return result;
    });
}
interface empresaFacturacionUpdateApi {
    success: true;
    empresa: EmpresasSchema;
}
interface empresaFacturacionUpdateApi {
    success: true;
    message: string;
    body: keyof EmpresasFacturacionCertificadoUpdateDto;
}
