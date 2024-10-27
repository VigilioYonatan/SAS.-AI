import { omitAsync, type Input } from "@vigilio/valibot";
import { citasSchema } from "../schemas/citas.schema";

export const citasStoreDto = omitAsync(citasSchema, ["id", "empresa_id"]);
export type CitasStoreDto = Input<typeof citasStoreDto>;
