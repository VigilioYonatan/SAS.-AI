import { omitAsync, type Input } from "valibot";
import { floorsSchema } from "../schemas/floors.schema";

export const floorsUpdateDto = omitAsync(floorsSchema, ["id", "empresa_id"]);
export type FloorsUpdateDto = Input<typeof floorsUpdateDto>;
