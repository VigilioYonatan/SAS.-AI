import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import type { InformationSchemaFromServer } from "../schemas/information.schema";

export function informationPrivateApi(): UseQuery<
	InformationPrivateAPI,
	InformationPrivateErrorAPI
> {
	return useQuery("/information/private", async (url) => {
		const response = await fetch(`/api${url}`);
		const result: InformationPrivateAPI = await response.json();
		if (!result.success) throw result;
		return result;
	});
}

export interface InformationPrivateAPI {
	success: boolean;
	information: InformationSchemaFromServer;
}

export interface InformationPrivateErrorAPI {
	success: boolean;
	message: string;
}
