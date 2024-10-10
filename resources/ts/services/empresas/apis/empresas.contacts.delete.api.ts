import { useMutation, type UseMutation } from "@vigilio/preact-fetching";
import type { ContactsSchema } from "../schemas/empresas.schema";

export function empresaContactsDestroyAllApi(): UseMutation<
    empresaContactsDestroyApi,
    unknown,
    empresaContactsDestroyApiError
> {
    return useMutation("/empresas/contacts", async (url) => {
        const response = await fetch(`/api${url}`, {
            method: "DELETE",
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
