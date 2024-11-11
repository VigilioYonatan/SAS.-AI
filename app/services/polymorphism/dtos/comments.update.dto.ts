import { pickAsync, type Input } from "@vigilio/valibot";
import { commentsSchema } from "../schemas/comments.schema";

export const commentsUpdateDto = pickAsync(commentsSchema, ["content"]);
export type CommentsUpdateDto = Input<typeof commentsUpdateDto>;
