import { omit, type Input } from "@vigilio/valibot";
import { emailsSchema } from "../schemas/emails.schema";

export const emailsStoreDto = omit(emailsSchema, ["id", "empresa_id"]);
export type EmailsStoreDto = Input<typeof emailsStoreDto>;
