import enviroments from "~/config";
import { useQuery } from "@vigilio/preact-fetching";
import type { ProvincesSchemaFromServer } from "../schemas/provinces.schema";

export function provincesIndexApi() {
	return useQuery<ProvincesIndexAPI, unknown>(
		"/ubigeo/provinces",
		async (url) => {
			const response = await fetch(`${enviroments.VITE_URL}/api${url}`);
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}

export interface ProvincesIndexAPI {
	success: boolean;
	data: ProvincesSchemaFromServer[];
}
