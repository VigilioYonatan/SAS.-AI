import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import type { MesasSchemaFromserver } from "@/orders/schemas/mesas.schema";

export type MesasIndexApiMethod = UseQuery<MesasIndexAPI, unknown>;
export function mesasIndexApi(): MesasIndexApiMethod {
	return useQuery<MesasIndexAPI, unknown>("/mesas", async (url) => {
		const response = await fetch(`}/api${url}`);
		const result = await response.json();
		if (!result.success) throw result;
		return result;
	});
}

export interface MesasIndexAPI {
	success: boolean;
	data: MesasSchemaFromserver[];
}
