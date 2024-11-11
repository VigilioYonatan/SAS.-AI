import { omitAsync, type Input } from "@vigilio/valibot";
import { postsSchema } from "../schemas/posts.schema";

export const postsStoreDto = omitAsync(postsSchema, [
    "id",
    "user_id",
    "empresa_id",
    "likes",
]);
export type PostsStoreDto = Input<typeof postsStoreDto>;
