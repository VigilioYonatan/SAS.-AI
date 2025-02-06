import { omitAsync, type Input } from "@vigilio/valibot";
import { citasSchema } from "../schemas/citas.schema";

export const citasUpdateDto = omitAsync(citasSchema, [
    "id",
    "empresa_id",
    "date",
]);
export type CitasUpdateDto = Input<typeof citasUpdateDto>;
