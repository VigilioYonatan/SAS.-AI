import { useMutation } from "@vigilio/preact-fetching";
import enviroments from "~/config";
import type { CommentsStoreDto } from "@/polymorphism/dtos/comments.store.dto";
import type { CommentsSchema } from "@/polymorphism/schemas/comments.schema";

export function commentsStoreApi(
	commentables_type: string,
	commentables_id: number,
) {
	return useMutation<CommentsStoreAPI, CommentsStoreDto, CommentsStoreErrorAPI>(
		`/comments/${commentables_type}/${commentables_id}`,
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

export interface CommentsStoreAPI {
	success: boolean;
	comment: CommentsSchema;
}

export interface CommentsStoreErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
