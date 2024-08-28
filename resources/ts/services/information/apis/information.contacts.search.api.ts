import { useQuery } from "@vigilio/preact-fetching";
import type { ContactsSchema } from "../schemas/information.schema";
import type { Signal } from "@preact/signals";

export function informationContactsSearchApi(name: Signal<string>) {
    return useQuery(
        `/information/contacts/${name.value}`,
        async (url) => {
            const response = await fetch(`/api${url}`);
            const result: InformationContactsSearchAPI = await response.json();
            if (!result.success) throw result;
            return result;
        },
        { skipFetching: true }
    );
}

export interface InformationContactsSearchAPI {
    success: boolean;
    data: ContactsSchema[];
}
