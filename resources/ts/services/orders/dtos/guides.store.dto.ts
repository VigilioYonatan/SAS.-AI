import { type Input, omit } from "@vigilio/valibot";
import { guidesSchema } from "../schemas/guides.schema";

export const guidesStoreDto = omit(guidesSchema, ["id"]);
export type GuidesStoreDto = Input<typeof guidesStoreDto>;
