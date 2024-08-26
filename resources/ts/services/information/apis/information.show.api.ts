import enviroments from "~/config";
import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import type { InformationSchemaFromServer } from "../schemas/information.schema";

export function informationShowApi(
	id: number | string,
	skip = true,
): UseQuery<InformationShowAPI, InformationShowErrorAPI> {
	return useQuery(
		`/information/${id}`,
		async (url) => {
			const response = await fetch(`${enviroments.VITE_URL}/api${url}`);
			const result: InformationShowAPI = await response.json();
			if (!result.success) throw result;
			return result;
		},
		{ skipFetching: skip },
	);
}

export interface InformationShowAPI {
	success: boolean;
	information: InformationSchemaFromServer;
}

export interface InformationShowErrorAPI {
	success: boolean;
	message: string;
}
