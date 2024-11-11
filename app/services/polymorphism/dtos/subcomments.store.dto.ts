import { pickAsync, type Input } from "@vigilio/valibot";
import { subcommentsSchema } from "../schemas/subcomments.schema";

export const subcommentsStoreDto = pickAsync(subcommentsSchema, ["content"]);
export type SubcommentsStoreDto = Input<typeof subcommentsStoreDto>;
