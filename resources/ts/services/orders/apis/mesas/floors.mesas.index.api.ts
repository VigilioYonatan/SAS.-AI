import { useMutation } from "@vigilio/preact-fetching";
import type { MesasSchemaFromserver } from "@/orders/schemas/mesas.schema";

export function floorMesasIndexApi() {
	return useMutation<FloorMesasIndexAPI, number, unknown>(
		"/floors",
		async (url, floor_id) => {
			const response = await fetch(`/api${url}/${floor_id}/mesas`);
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}

export interface FloorMesasIndexAPI {
	success: boolean;
	data: MesasSchemaFromserver[];
}
