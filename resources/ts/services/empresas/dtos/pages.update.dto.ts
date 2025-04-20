import { omitAsync, pick, type Input } from "@vigilio/valibot";
import { pagesSchema } from "../schemas/pages.schema";
import { pagesStoreDto } from "./pages.store.dto";

export const pagesUpdateDto = omitAsync(pagesSchema, [
    "id",
    "empresa_id",
    "isDinamic",
    "favicon",
    "ogg_favicon",
]);
export type PagesUpdateDto = Input<typeof pagesUpdateDto>;

export const pagesUpdateFaviconDto = pick(pagesStoreDto, ["favicon"]);
export type PagesUpdateFaviconDto = Input<typeof pagesUpdateFaviconDto>;

export const pagesUpdateOGGFaviconDto = pick(pagesStoreDto, ["ogg_favicon"]);
export type PagesUpdateOGGFaviconDto = Input<typeof pagesUpdateOGGFaviconDto>;
