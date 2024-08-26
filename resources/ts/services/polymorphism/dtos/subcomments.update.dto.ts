import { type Input, pick } from "@vigilio/valibot";
import { commentsSchema } from "../schemas/comments.schema";

export const subcommentsUpdateDto = pick(commentsSchema, ["content"]);
export type SubcommentsUpdateDto = Input<typeof subcommentsUpdateDto>;
