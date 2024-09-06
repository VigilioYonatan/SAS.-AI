import { FloorsStoreDto } from "@/orders/dtos/floors.store.dto";
import type { FloorsSchema } from "@/orders/schemas/floors.schema";
import { useMutation } from "@vigilio/preact-fetching";

export function floorsStoreApi() {
	return useMutation<FloorsStoreAPI, FloorsStoreDto, FloorsStoreErrorAPI>(
		"/floors",
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

export interface FloorsStoreAPI {
	success: boolean;
	floor: FloorsSchema;
}

export interface FloorsStoreErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
