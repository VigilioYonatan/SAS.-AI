import { useMutation, type UseMutation } from "@vigilio/preact-fetching";
import type { ContactsSchema } from "../schemas/information.schema";

export type InformationContactsIndexApiMethod = UseMutation<
    InformationContactsIndexAPI,
    unknown,
    unknown
>;

export function informationContactsIndexApi(): InformationContactsIndexApiMethod {
    return useMutation("/information/contacts", async (url) => {
        const response = await fetch(`/api${url}`);
        const result: InformationContactsIndexAPI = await response.json();
        if (!result.success) throw result;
        return result;
    });
}

export interface InformationContactsIndexAPI {
    success: boolean;
    data: ContactsSchema[];
}
