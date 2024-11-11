import { type Input, pick } from "@vigilio/valibot";
import { subcommentsSchema } from "../schemas/subcomments.schema";

export const subcommentsStoreDto = pick(subcommentsSchema, ["content"]);
export type SubcommentsStoreDto = Input<typeof subcommentsStoreDto>;
