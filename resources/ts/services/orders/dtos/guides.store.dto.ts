import { type Input, omit } from "@vigilio/valibot";
import { guidesSchema } from "../schemas/guides.schema";

export const guidesStoreDto = omit(guidesSchema, ["id", "empresa_id"]);
export type GuidesStoreDto = Input<typeof guidesStoreDto>;
