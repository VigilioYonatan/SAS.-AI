import { omit, type Input } from "@vigilio/valibot";
import { finanzasSchema } from "../schemas/finanzas.schema";

export const finanzasStoreDto = omit(finanzasSchema, ["id", "empresa_id"]);
export type FinanzasStoreDto = Input<typeof finanzasStoreDto>;
