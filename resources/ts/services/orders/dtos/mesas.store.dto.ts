import { omit, type Input } from "valibot";
import { mesasSchema } from "../schemas/mesas.schema";

export const mesasStoreDto = omit(mesasSchema, ["id", "mesa_code"]);
export type MesasStoreDto = Input<typeof mesasStoreDto>;
