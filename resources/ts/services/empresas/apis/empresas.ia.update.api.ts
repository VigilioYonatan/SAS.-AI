import { useMutation, type UseMutation } from "@vigilio/preact-fetching";
import { EmpresasIAUpdateDto } from "../dtos/empresas.ia.update.dto";
export function empresaIAUpdateApi(): UseMutation<
    EmpresaIAUpdateApi,
    EmpresasIAUpdateDto,
    EmpresaIAUpdateApiError
> {
    return useMutation("/empresas/ia", async (url, body) => {
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

interface EmpresaIAUpdateApi {
    success: true;
    message: string;
}
interface EmpresaIAUpdateApiError {
    success: true;
    message: string;
    body: keyof EmpresasIAUpdateDto;
}
