import { type Input, omit } from "@vigilio/valibot";
import { invoicesSchema } from "../schemas/invoices.schema";

export const invoicesStoreDto = omit(invoicesSchema, ["id"]);
export type InvoicesStoreDto = Input<typeof invoicesStoreDto>;
