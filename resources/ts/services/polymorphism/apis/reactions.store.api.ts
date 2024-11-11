import { useMutation } from "@vigilio/preact-fetching";
import type { ReactionsStoreDto } from "@/polymorphism/dtos/reactions.store.dto";
import type { ReactionsSchema } from "@/polymorphism/schemas/reactions.schema";

export function reactionsStoreApi(
	reactionsable_type: string,
	reactionsable_id: number,
) {
	return useMutation<
		ReactionsStoreAPI,
		ReactionsStoreDto,
		ReactionsStoreErrorAPI
	>(
		`/reactions/${reactionsable_type}/${reactionsable_id}`,
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

export interface ReactionsStoreAPI {
	success: boolean;
	reaction: ReactionsSchema;
}

export interface ReactionsStoreErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
