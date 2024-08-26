import { type Input, string, object } from "@vigilio/valibot";

export const kindCreditNotesSchema = object({
	code: string(),
	name: string(),
});

export type KindCreditNotesSchema = Input<typeof kindCreditNotesSchema> & {
	createdAt?: Date;
	updatedAt?: Date;
};
