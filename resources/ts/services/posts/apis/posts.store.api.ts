import { useMutation } from "@vigilio/preact-fetching";
import type { PostsSchemaFromServer } from "../schemas/posts.schema";
import { uploadApi } from "~/libs/upload";
import type { PostsStoreDto } from "../dtos/posts.store.dto";

export const PostsstoreUploadImage = "/uploads/posts/image";

export function postsStoreApi() {
	return useMutation<PostsStoreAPI, PostsStoreDto, PostsStoreErrorAPI>(
		"/posts",
		async (url, body) => {
			const resultImage = await uploadApi(`/api${PostsstoreUploadImage}`, {
				file: body.image,
			});
			const response = await fetch(`/api${url}`, {
				body: JSON.stringify({ ...body, image: resultImage.files }),
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

export interface PostsStoreAPI {
	success: boolean;
	post: PostsSchemaFromServer;
}

export interface PostsStoreErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
