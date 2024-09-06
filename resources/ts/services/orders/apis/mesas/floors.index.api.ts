import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import type { FloorsSchema } from "@/orders/schemas/floors.schema";

export type FloorsIndexApiMethod = UseQuery<FloorsIndexAPI, unknown>;
export function floorsIndexApi(): FloorsIndexApiMethod {
	return useQuery<FloorsIndexAPI, unknown>(
		"/floors",
		async (url) => {
			const response = await fetch(`/api${url}`);
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
		{ clean: false },
	);
}

export interface FloorsIndexAPI {
	success: boolean;
	data: FloorsSchema[];
}
