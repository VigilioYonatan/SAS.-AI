import { omitAsync, type Input } from "@vigilio/valibot";
import { crudSchema } from "../schemas/crud.schema";

export const crudUpdateDto = omitAsync(crudSchema, ["id", "empresa_id"]);
export type CrudUpdateDto = Input<typeof crudUpdateDto>;
