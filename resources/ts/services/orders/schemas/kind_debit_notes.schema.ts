import { type Input, string, object } from "@vigilio/valibot";

export const kindDebitNotesSchema = object({
	code: string(),
	name: string(),
});

export type KindDebitNotesSchema = Input<typeof kindDebitNotesSchema> & {
	createdAt?: Date;
	updatedAt?: Date;
};
