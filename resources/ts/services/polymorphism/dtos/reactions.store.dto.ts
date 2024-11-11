import { type Input, pick } from "@vigilio/valibot";
import { reactionsSchema } from "../schemas/reactions.schema";

export const reactionsStoreDto = pick(reactionsSchema, ["isLike"]);
export type ReactionsStoreDto = Input<typeof reactionsStoreDto>;
