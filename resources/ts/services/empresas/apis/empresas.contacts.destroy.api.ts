import { useMutation, type UseMutation } from "@vigilio/preact-fetching";
import type { ContactsSchema } from "../schemas/empresas.schema";

export function empresaContactsDestroyApi(): UseMutation<
    empresaContactsDestroyApi,
    { telephone: string },
    empresaContactsDestroyApiError
> {
    return useMutation("/empresas/contacts", async (url, body) => {
        const response = await fetch(`/api${url}/${body.telephone}`, {
            method: "DELETE",
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
interface empresaContactsDestroyApi {
    success: true;
    message: string;
}
interface empresaContactsDestroyApiError {
    success: true;
    message: string;
    body: keyof ContactsSchema;
}
