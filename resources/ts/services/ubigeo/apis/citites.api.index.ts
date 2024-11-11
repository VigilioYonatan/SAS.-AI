import { useQuery } from "@vigilio/preact-fetching";
import type { CitiesSchemaFromServer } from "../schemas/cities.schema";

export function citiesIndexApi() {
	return useQuery<CitiesIndexAPI, unknown>(
		"/ubigeo/cities",
		async (url) => {
			const response = await fetch(`/api${url}`);
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
		{
			isCaching: 12 * 60 * 1000 * 60,
		},
	);
}

export interface CitiesIndexAPI {
	success: boolean;
	data: CitiesSchemaFromServer[];
}
