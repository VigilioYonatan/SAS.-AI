import { omitAsync, type Input } from "@vigilio/valibot";
import { postsSchema } from "../schemas/posts.schema";

export const postsUpdateDto = omitAsync(postsSchema, [
	"id",
	"image",
	"user_id",
	"empresa_id",
]);
export type PostsUpdateDto = Input<typeof postsUpdateDto>;
