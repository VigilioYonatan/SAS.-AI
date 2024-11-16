import { omitAsync, type Input } from "@vigilio/valibot";
import { newSchema } from "../schemas/new.schema";

export const newUpdateDto = omitAsync(newSchema, ["id", "empresa_id", "image"]);
export type NewUpdateDto = Input<typeof newUpdateDto>;
