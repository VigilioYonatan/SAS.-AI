import { useMutation, type UseMutation } from "@vigilio/preact-fetching";
import { ContactsSchema } from "../schemas/empresas.schema";

export type empresaContactsIndexApiMethod = UseMutation<
    empresaContactsIndexAPI,
    unknown,
    unknown
>;

export function empresaContactsIndexApi(): empresaContactsIndexApiMethod {
    return useMutation("/empresas/contacts", async (url) => {
        const response = await fetch(`/api${url}`);
        const result: empresaContactsIndexAPI = await response.json();
        if (!result.success) throw result;
        return result;
    });
}

export interface empresaContactsIndexAPI {
    success: boolean;
    data: ContactsSchema[];
}
