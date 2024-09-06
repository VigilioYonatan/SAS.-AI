import { type Input, omit } from "@vigilio/valibot";
import { urlsSchema } from "../schemas/urls.schema";

export const urlsUpdateDto = omit(urlsSchema, ["id", "empresa_id"]);

export type UrlsUpdateDto = Input<typeof urlsUpdateDto>;
