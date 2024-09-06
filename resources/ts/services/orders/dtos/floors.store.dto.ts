import { omit, type Input } from "valibot";
import { floorsSchema } from "../schemas/floors.schema";

export const floorsStoreDto = omit(floorsSchema, ["id"]);
export type FloorsStoreDto = Input<typeof floorsStoreDto>;
