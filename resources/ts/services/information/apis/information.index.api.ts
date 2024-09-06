import {
	type UseQuery,
	useQuery,
	type OptionsQuery,
} from "@vigilio/preact-fetching";
import type { InformationSchemaFromServer } from "../schemas/information.schema";

export type InformationIndexApiMethod = UseQuery<InformationIndexAPI, unknown>;

export function informationIndexApi(
	options?: OptionsQuery<InformationIndexAPI, unknown>,
): InformationIndexApiMethod {
	return useQuery(
		"/information",
		async (url) => {
			const response = await fetch(`/api${url}`);
			const result: InformationIndexAPI = await response.json();
			if (!result.success) throw result;
			return result;
		},
		options,
	);
}

export interface InformationIndexAPI {
	success: boolean;
	data: InformationSchemaFromServer[];
}

export interface Logo {
	dimension: number;
	file: string;
}
