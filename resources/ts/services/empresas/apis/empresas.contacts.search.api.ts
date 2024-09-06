import { useQuery } from "@vigilio/preact-fetching";
import type { Signal } from "@preact/signals";
import { ContactsSchema } from "../schemas/empresas.schema";

export function empresaContactsSearchApi(name: Signal<string>) {
    return useQuery(
        `/empresa/contacts/${name.value}`,
        async (url) => {
            const response = await fetch(`/api${url}`);
            const result: empresaContactsSearchAPI = await response.json();
            if (!result.success) throw result;
            return result;
        },
        { skipFetching: true }
    );
}

export interface empresaContactsSearchAPI {
    success: boolean;
    data: ContactsSchema[];
}
