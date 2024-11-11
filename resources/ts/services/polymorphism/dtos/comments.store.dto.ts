import { type Input, pick } from "@vigilio/valibot";
import { commentsSchema } from "../schemas/comments.schema";

export const commentsStoreDto = pick(commentsSchema, ["content"]);
export type CommentsStoreDto = Input<typeof commentsStoreDto>;
