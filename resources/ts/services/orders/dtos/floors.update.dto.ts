import { omit, type Input } from "valibot";
import { floorsSchema } from "../schemas/floors.schema";

export const floorsUpdateDto = omit(floorsSchema, ["id", "name", "empresa_id"]);
export type FloorsUpdateDto = Input<typeof floorsUpdateDto>;
