import { useMutation, type UseMutation } from "@vigilio/preact-fetching";
import { ContactsSchema } from "../schemas/empresas.schema";

export type empresaContactsFavoritesApiMethod = UseMutation<
	empresaContactsFavoritesAPI,
	null,
	unknown
>;

export function empresaContactsFavoritesApi(): empresaContactsFavoritesApiMethod {
	return useMutation("/empresas/contacts/favorites", async (url) => {
		const response = await fetch(`/api${url}`);
		const result: empresaContactsFavoritesAPI = await response.json();
		if (!result.success) throw result;
		return result;
	});
}

export interface empresaContactsFavoritesAPI {
	success: boolean;
	favorites: ContactsSchema[];
}
