import { useMutation, useQuery } from "@vigilio/preact-fetching";
import { RegionsSchemaFromServer } from "../schemas/regions.schema";

export function regionsShowApi(id: string) {
	return useQuery<RegionsShowAPI, unknown>(
		`/ubigeo/regions/${id}`,
		async (url) => {
			const response = await fetch(`/api${url}`);
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}
export function regionsShowMutationApi() {
	return useMutation<RegionsShowAPI, number, unknown>(
		"/ubigeo/regions",
		async (url, id) => {
			const response = await fetch(`/api${url}/${id}`);
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}

export interface RegionsShowAPI {
	success: boolean;
	data: RegionsSchemaFromServer;
}
