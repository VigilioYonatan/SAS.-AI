import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import type { MesasOrdersSchemaFromServer } from "@/orders/schemas/mesas.schema";

export type MesasOrdersFloorShowApiMethod = UseQuery<
	MesasOrdersFloorShowAPI,
	unknown
>;
export function mesasOrdersFloorShowApi(
	floor_id: number,
): MesasOrdersFloorShowApiMethod {
	return useQuery<MesasOrdersFloorShowAPI, unknown>(
		`/mesas/${floor_id}/orders`,
		async (url) => {
			const response = await fetch(`/api${url}`);
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}

export interface MesasOrdersFloorShowAPI {
	success: boolean;
	data: MesasOrdersSchemaFromServer[];
}
