import {
	type UseQuery,
	useQuery,
	type OptionsQuery,
} from "@vigilio/preact-fetching";
import type { BackgroundSchemaFromServer } from "../schemas/background.schema";

export type BackgroundIndexApiMethod = UseQuery<BackgroundIndexAPI, unknown>;

export function backgroundIndexApi(
	options?: OptionsQuery<BackgroundIndexAPI, unknown>,
): BackgroundIndexApiMethod {
	return useQuery(
		"/background",
		async (url) => {
			const response = await fetch(`/api${url}`);
			const result: BackgroundIndexAPI = await response.json();
			if (!result.success) throw result;
			return result;
		},
		options,
	);
}

export interface BackgroundIndexAPI {
	success: boolean;
	data: BackgroundSchemaFromServer[];
}

export interface Logo {
	dimension: number;
	file: string;
}
