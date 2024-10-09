import { omit, type Input } from "@vigilio/valibot";
import { newSchema } from "../schemas/new.schema";

export const newStoreDto = omit(newSchema, ["id", "empresa_id"]);
export type NewStoreDto = Input<typeof newStoreDto>;
