import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import type { BackgroundSchemaFromServer } from "../schemas/background.schema";

export function backgroundShowApi(
	id: number,
): UseQuery<BackgroundShowAPI, BackgroundShowErrorAPI> {
	return useQuery<BackgroundShowAPI, BackgroundShowErrorAPI>(
		`/background/${id}`,
		async (url) => {
			const response = await fetch(`/api${url}`);
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}

export interface BackgroundShowAPI {
	success: boolean;
	background: BackgroundSchemaFromServer;
}

export interface BackgroundShowErrorAPI {
	success: boolean;
	message: string;
}
