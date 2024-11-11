import { useMutation } from "@vigilio/preact-fetching";

export function commentsDestroyApi(
	commentables_type: string,
	commentables_id: number,
) {
	return useMutation<CommentsDestroyAPI, number, CommentsDestroyErrorAPI>(
		`/comments/${commentables_type}/${commentables_id}`,
		async (url, id) => {
			const response = await fetch(`/api${url}/${id}`, {
				method: "DELETE",
			});
			const result = await response.json();

			if (!result.success) throw result;
			return result;
		},
	);
}

export interface CommentsDestroyErrorAPI {
	success: boolean;
	message: string;
}
export interface CommentsDestroyAPI {
	success: boolean;
	message: string;
}
