import { pickAsync, type Input } from "@vigilio/valibot";
import { subcommentsSchema } from "../schemas/subcomments.schema";

export const subcommentsUpdateDto = pickAsync(subcommentsSchema, ["content"]);
export type SubcommentsUpdateDto = Input<typeof subcommentsUpdateDto>;
