import { pickAsync, type Input } from "@vigilio/valibot";
import { reactionsSchema } from "../schemas/reactions.schema";

export const reactionsUpdateDto = pickAsync(reactionsSchema, ["isLike"]);
export type ReactionsUpdateDto = Input<typeof reactionsUpdateDto>;
