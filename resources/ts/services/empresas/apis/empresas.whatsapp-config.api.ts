import { useMutation, type UseMutation } from "@vigilio/preact-fetching";
import { ContactsSchema, Whatsappconfig } from "../schemas/empresas.schema";

export function empresaWhatsappConfigUpdateApi(): UseMutation<
    empresaWhatsappConfigUpdateApi,
    Whatsappconfig,
    empresaWhatsappConfigUpdateApiError
> {
    return useMutation("/empresas/whatsapp-config", async (url, body) => {
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
interface empresaWhatsappConfigUpdateApi {
    success: true;
    message: string;
}
interface empresaWhatsappConfigUpdateApiError {
    success: true;
    message: string;
    body: keyof ContactsSchema;
}
