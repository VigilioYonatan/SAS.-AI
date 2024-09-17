import {
	type UseQuery,
	useQuery,
	type OptionsQuery,
} from "@vigilio/preact-fetching";
import { EmpresasSchemaFromServer } from "../schemas/empresas.schema";

export type empresaIndexApiMethod = UseQuery<empresaIndexAPI, unknown>;

export function empresaIndexApi(
	options?: OptionsQuery<empresaIndexAPI, unknown>,
): empresaIndexApiMethod {
	return useQuery(
		"/empresas",
		async (url) => {
			const response = await fetch(`/api${url}`);
			const result: empresaIndexAPI = await response.json();
			if (!result.success) throw result;
			return result;
		},
		options,
	);
}

export interface empresaIndexAPI {
	success: boolean;
	data: EmpresasSchemaFromServer[];
}

export interface Logo {
	dimension: number;
	file: string;
}
