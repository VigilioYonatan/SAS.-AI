import {
	instance,
	merge,
	object,
	omit,
	type Input,
	array,
} from "@vigilio/valibot";
import { postsSchema } from "../schemas/posts.schema";
import validFileValibot from "~/libs/valibot";

export const postsStoreDto = merge([
	omit(postsSchema, ["id", "image", "user_id", "empresa_id", "likes"]),
	object({
		image: array(instance(File), [
			validFileValibot({
				required: true,
				min: 1,
				max: 1,
				types: [
					"image/webp",
					"image/jpg",
					"image/jpeg",
					"image/png",
					"image/gif",
				],
			}),
		]),
	}),
]);
export type PostsStoreDto = Input<typeof postsStoreDto>;
