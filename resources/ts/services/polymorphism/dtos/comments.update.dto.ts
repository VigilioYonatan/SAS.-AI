import { type Input, pick } from "@vigilio/valibot";
import { commentsSchema } from "../schemas/comments.schema";

export const commentsUpdateDto = pick(commentsSchema, ["content"]);
export type CommentsUpdateDto = Input<typeof commentsUpdateDto>;
