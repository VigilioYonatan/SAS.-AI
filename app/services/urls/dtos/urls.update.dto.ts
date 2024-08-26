import { omitAsync, type Input } from "@vigilio/valibot";
import { urlsSchema } from "../schemas/urls.schema";

export const urlsUpdateDto = omitAsync(urlsSchema, ["id"]);
export type UrlsUpdateDto = Input<typeof urlsUpdateDto>;
