import { useMutation } from "@vigilio/preact-fetching";
import { FinanzasStoreDto } from "../dtos/finanzas.store.dto";
import { FinanzasSchemaFromServer } from "../schemas/finanzas.schema";

export function finanzasUpdateApi(id: number) {
    return useMutation<
        FinanzasUpdateAPI,
        FinanzasStoreDto,
        FinanzasUpdateErrorAPI
    >(`/finanzas/${id}`, async (url, body) => {
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

export interface FinanzasUpdateAPI {
    success: boolean;
    supplier: FinanzasSchemaFromServer;
}
export interface FinanzasUpdateErrorAPI {
    success: boolean;
    message: string;
    body: string;
}
