import { omitAsync, type Input } from "@vigilio/valibot";
import { pagesSchema } from "../schemas/pages.schema";

export const pagesUpdateDto = omitAsync(pagesSchema, [
    "id",
    "empresa_id",
    "isDinamic",
    "favicon",
    "ogg_favicon",
]);
export type PagesUpdateDto = Input<typeof pagesUpdateDto>;
