import { useMutation, type UseMutation } from "@vigilio/preact-fetching";
import type { ContactsSchema } from "../schemas/information.schema";

export type InformationContactsFavoritesApiMethod = UseMutation<
    InformationContactsFavoritesAPI,
    null,
    unknown
>;

export function informationContactsFavoritesApi(): InformationContactsFavoritesApiMethod {
    return useMutation("/information/contacts/favorites", async (url) => {
        const response = await fetch(`/api${url}`);
        const result: InformationContactsFavoritesAPI = await response.json();
        if (!result.success) throw result;
        return result;
    });
}

export interface InformationContactsFavoritesAPI {
    success: boolean;
    favorites: ContactsSchema[];
}
