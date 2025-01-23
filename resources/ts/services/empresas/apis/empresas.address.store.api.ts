import { useMutation, type UseMutation } from "@vigilio/preact-fetching";
import { EmpresaAddressUpdateDto } from "../dtos/empresas.address.update.dto";
export function EmpresaAddressStoreApi(): UseMutation<
    EmpresaAddressStoreApi,
    EmpresaAddressUpdateDto,
    EmpresaAddressStoreApiError
> {
    return useMutation("/empresas/address", async (url, body) => {
        const response = await fetch(`/api${url}`, {
            method: "POST",
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

interface EmpresaAddressStoreApi {
    success: true;
    message: string;
}
interface EmpresaAddressStoreApiError {
    success: true;
    message: string;
    body: keyof EmpresaAddressUpdateDto;
}
