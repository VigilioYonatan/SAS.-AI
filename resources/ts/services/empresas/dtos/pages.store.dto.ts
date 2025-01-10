import { omitAsync, type Input } from "@vigilio/valibot";
import { pagesSchema } from "../schemas/pages.schema";

export const pagesStoreDto = omitAsync(pagesSchema, ["id", "isDinamic"]);
export type PagesStoreDto = Input<typeof pagesStoreDto>;
