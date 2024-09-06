import { useMutation } from "@vigilio/preact-fetching";
import type {
	PostsImageUpdateDto,
	PostsUpdateDto,
} from "../dtos/posts.update.dto";
import type { PostsSchemaFromServer } from "../schemas/posts.schema";
import { uploadApi, type ResultApiImages } from "~/libs/upload";
import { PostsstoreUploadImage } from "./posts.store.api";

export function postsUpdateApi(id: number) {
	return useMutation<PostsUpdateAPI, PostsUpdateDto, PostsUpdateErrorAPI>(
		`/posts/${id}`,
		async (url, body) => {
			const response = await fetch(`/api${url}`, {
				method: "PUT",
				body: JSON.stringify(body),
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
export function postsUpdateImageApi(id: number) {
	return useMutation<ResultApiImages, PostsImageUpdateDto, PostsUpdateErrorAPI>(
		`${PostsstoreUploadImage}/${id}`,
		async (url, body) => {
			const result = await uploadApi(`/api${url}`, {
				file: body.image,
			});
			return result;
		},
	);
}
export interface PostsUpdateAPI {
	success: boolean;
	post: PostsSchemaFromServer;
}
export interface PostsUpdateErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
