import { useMutation } from "@vigilio/preact-fetching";
import type { CommentsUpdateDto } from "@/polymorphism/dtos/comments.update.dto";
import type { CommentsSchema } from "@/polymorphism/schemas/comments.schema";

export function commentsUpdateApi(
	commentables_type: string,
	commentables_id: number,
	id: number,
) {
	return useMutation<
		CommentsUpdateAPI,
		CommentsUpdateDto,
		CommentsUpdateErrorAPI
	>(
		`/comments/${commentables_type}/${commentables_id}/${id}`,
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

export interface CommentsUpdateAPI {
	success: boolean;
	comment: CommentsSchema;
}

export interface CommentsUpdateErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
