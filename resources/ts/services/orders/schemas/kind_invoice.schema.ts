import { type Input, string, object } from "@vigilio/valibot";

export const kindInvoiceSchema = object({
	code: string(),
	name: string(),
});

export type KindInvoiceSchema = Input<typeof kindInvoiceSchema> & {
	createdAt?: Date;
	updatedAt?: Date;
};
