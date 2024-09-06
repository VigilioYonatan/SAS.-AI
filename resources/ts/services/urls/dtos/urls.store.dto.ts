import { type Input, omit } from "@vigilio/valibot";
import { urlsSchema } from "../schemas/urls.schema";

export const urlsStoreDto = omit(urlsSchema, ["id"]);

export type UrlsStoreDto = Input<typeof urlsStoreDto>;
