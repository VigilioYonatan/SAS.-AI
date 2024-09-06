import { omitAsync, type Input } from "@vigilio/valibot";
import { newSchema } from "../schemas/new.schema";

export const newStoreDto = omitAsync(newSchema, ["id", "information_id"]);
export type NewStoreDto = Input<typeof newStoreDto>;
