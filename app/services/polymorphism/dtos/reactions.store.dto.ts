import { pickAsync, type Input } from "@vigilio/valibot";
import { reactionsSchema } from "../schemas/reactions.schema";

export const reactionsStoreDto = pickAsync(reactionsSchema, ["isLike"]);
export type ReactionsStoreDto = Input<typeof reactionsStoreDto>;
