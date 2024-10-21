import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import { TipoFinanzasSchema } from "../schemas/tipo.schema";

export function tiposIndexApi(): UseQuery<TiposIndexAPI, TiposIndexErrorAPI> {
	return useQuery<TiposIndexAPI, TiposIndexErrorAPI>(
		"/finanzas/tipos",
		async (url) => {
			const response = await fetch(`/api${url}`);
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}

export interface TiposIndexAPI {
	success: boolean;
	data: TipoFinanzasSchema[];
}

export interface TiposIndexErrorAPI {
	success: boolean;
	message: string;
}
