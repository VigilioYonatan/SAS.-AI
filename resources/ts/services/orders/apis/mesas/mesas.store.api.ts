import type { MesasStoreDto } from "@/orders/dtos/mesas.store.dto";
import type { MesasSchema } from "@/orders/schemas/mesas.schema";
import { useMutation } from "@vigilio/preact-fetching";

export function mesasStoreApi() {
	return useMutation<MesasStoreAPI, MesasStoreDto, MesasStoreErrorAPI>(
		"/mesas",
		async (url, body) => {
			const response = await fetch(`/api${url}`, {
				method: "POST",
				body: JSON.stringify(body),
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

export interface MesasStoreAPI {
	success: boolean;
	mesa: MesasSchema;
}

export interface MesasStoreErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
