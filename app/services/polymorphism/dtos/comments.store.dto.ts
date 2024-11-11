import { pickAsync, type Input } from "@vigilio/valibot";
import { commentsSchema } from "../schemas/comments.schema";

export const commentsStoreDto = pickAsync(commentsSchema, ["content"]);
export type CommentsStoreDto = Input<typeof commentsStoreDto>;
