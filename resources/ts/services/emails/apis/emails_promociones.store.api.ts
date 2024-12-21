import { useMutation } from "@vigilio/preact-fetching";
import type { EmailsPromocionesStoreDto } from "../dtos/emails_promociones.store.dto";

export function emailsPromocionesStoreApi() {
    return useMutation<
        EmailsPromocionesStoreAPI,
        EmailsPromocionesStoreDto,
        EmailsPromocionesStoreErrorAPI
    >("/emails_promociones", async (url, body) => {
        const response = await fetch(`/api${url}`, {
            body: JSON.stringify(body),
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

export interface EmailsPromocionesStoreAPI {
    success: boolean;
    message: string;
}

export interface EmailsPromocionesStoreErrorAPI {
    success: boolean;
    message: string;
    body: string;
}
