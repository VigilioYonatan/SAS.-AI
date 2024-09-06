import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import type { PostsSchemaFromServer } from "../schemas/posts.schema";

export function postsShowApi(
	id: number,
): UseQuery<PostsShowAPI, PostsShowErrorAPI> {
	return useQuery<PostsShowAPI, PostsShowErrorAPI>(
		`/posts/${id}`,
		async (url) => {
			const response = await fetch(`/api${url}`);
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}

export interface PostsShowAPI {
	success: boolean;
	post: PostsSchemaFromServer;
}

export interface PostsShowErrorAPI {
	success: boolean;
	message: string;
}
