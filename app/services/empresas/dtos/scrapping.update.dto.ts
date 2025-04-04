import { omitAsync, type Input } from "@vigilio/valibot";
import { scrappingSchema } from "../schemas/scrapping.schema";

export const scrappingUpdateDto = omitAsync(scrappingSchema, ["id"]);
export type ScrappingUpdateDto = Input<typeof scrappingUpdateDto>;
