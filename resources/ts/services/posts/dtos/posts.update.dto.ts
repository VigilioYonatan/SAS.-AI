import { omit, pick, type Input } from "@vigilio/valibot";
import { postsSchema } from "../schemas/posts.schema";
import { postsStoreDto } from "./posts.store.dto";

export const postsUpdateDto = omit(postsSchema, [
	"id",
	"image",
	"user_id",
	"information_id",
]);
export const postsImageUpdateDto = pick(postsStoreDto, ["image"]);

export type PostsUpdateDto = Input<typeof postsUpdateDto>;
export type PostsImageUpdateDto = Input<typeof postsImageUpdateDto>;
