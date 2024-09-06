import { SettingsSchemaFromServer } from "@/information/schemas/settings.schema";
import {
	type UseQuery,
	useQuery,
	type OptionsQuery,
} from "@vigilio/preact-fetching";

export type SettingsIndexApiMethod = UseQuery<SettingsIndexAPI, unknown>;

export function settingsIndexApi(
	options?: OptionsQuery<SettingsIndexAPI, unknown>,
): SettingsIndexApiMethod {
	return useQuery(
		"/settings",
		async (url) => {
			const response = await fetch(`/api${url}`);
			const result: SettingsIndexAPI = await response.json();
			if (!result.success) throw result;
			return result;
		},
		options,
	);
}

export interface SettingsIndexAPI {
	success: boolean;
	data: SettingsSchemaFromServer;
}

export interface Logo {
	dimension: number;
	file: string;
}
