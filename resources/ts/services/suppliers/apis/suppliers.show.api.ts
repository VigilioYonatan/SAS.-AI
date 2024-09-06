import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import type { SuppliersSchemaFromServer } from "../schemas/suppliers.schema";

export function suppliersShowApi(
	code: number | string,
): UseQuery<SuppliersShowAPI, SuppliersShowErrorAPI> {
	return useQuery<SuppliersShowAPI, SuppliersShowErrorAPI>(
		`/suppliers/${code}`,
		async (url) => {
			const response = await fetch(`/api${url}`);
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}

export interface SuppliersShowAPI {
	success: boolean;
	supplier: SuppliersSchemaFromServer;
}

export interface SuppliersShowErrorAPI {
	success: boolean;
	message: string;
}
