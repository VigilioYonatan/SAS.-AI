import { pick, type Input } from "@vigilio/valibot";
import { reactionsSchema } from "../schemas/reactions.schema";

export const reactionsUpdateDto = pick(reactionsSchema, ["isLike"]);
export type ReactionsUpdateDto = Input<typeof reactionsUpdateDto>;
