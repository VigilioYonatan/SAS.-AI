import { useMutation } from "@vigilio/preact-fetching";
import type { RatingsUpdateDto } from "@/polymorphism/dtos/ratings.update.dto";
import type { RatingsSchema } from "@/polymorphism/schemas/ratings.schema";

export function ratingsUpdateApi(
	ratingsable_type: string,
	ratingsable_id: number,
) {
	return useMutation<RatingsUpdateAPI, RatingsUpdateDto, RatingsUpdateErrorAPI>(
		`/ratings/${ratingsable_type}/${ratingsable_id}`,
		async (url, body) => {
			const response = await fetch(`/api${url}`, {
				body: JSON.stringify(body),
				method: "PUT",
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

export interface RatingsUpdateAPI {
	success: boolean;
	reaction: RatingsSchema;
}

export interface RatingsUpdateErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
