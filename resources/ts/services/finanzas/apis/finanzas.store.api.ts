import { useMutation } from "@vigilio/preact-fetching";
import type { FinanzasSchemaFromServer } from "../schemas/finanzas.schema";
import type { FinanzasStoreDto } from "../dtos/finanzas.store.dto";

export function finanzasStoreApi() {
	return useMutation<FinanzasStoreAPI, FinanzasStoreDto, FinanzasStoreErrorAPI>(
		"/finanzas",
		async (url, body) => {
			const response = await fetch(`/api${url}`, {
				body: JSON.stringify(body),
				method: "POST",
				headers: {
					"content-type": "application/json",
				},
			});
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}

export interface FinanzasStoreAPI {
	success: boolean;
	finanza: FinanzasSchemaFromServer;
}

export interface FinanzasStoreErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
