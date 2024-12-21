import { omitAsync, type Input } from "@vigilio/valibot";
import { emailsSchema } from "../schemas/emails.schema";

export const emailsStoreDto = omitAsync(emailsSchema, ["id"]);
export type EmailsStoreDto = Input<typeof emailsStoreDto>;
