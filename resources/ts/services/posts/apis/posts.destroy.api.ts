import { useMutation } from "@vigilio/preact-fetching";

export function postsDestroyApi() {
	return useMutation<PostsDestroyAPI, number, PostsDestroyErrorAPI>(
		"/posts",
		async (url, id: number) => {
			const response = await fetch(`/api${url}/${id}`, {
				method: "DELETE",
			});
			const result = await response.json();

			if (!result.success) throw result;
			return result;
		},
	);
}

export interface PostsDestroyErrorAPI {
	success: boolean;
	message: string;
}
export interface PostsDestroyAPI {
	success: boolean;
	message: string;
}
