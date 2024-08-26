import { useMutation } from "@vigilio/preact-fetching";
import enviroments from "~/config";
import type { RatingsStoreDto } from "../dtos/ratings.store.dto";
import type { RatingsSchema } from "../schemas/ratings.schema";

export function ratingsStoreApi(
	ratingsable_type: string,
	ratingsable_id: number,
) {
	return useMutation<RatingsStoreAPI, RatingsStoreDto, RatingsStoreErrorAPI>(
		`/ratings/${ratingsable_type}/${ratingsable_id}`,
		async (url, body) => {
			const response = await fetch(`${enviroments.VITE_URL}/api${url}`, {
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

export interface RatingsStoreAPI {
	success: boolean;
	reaction: RatingsSchema;
}

export interface RatingsStoreErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
