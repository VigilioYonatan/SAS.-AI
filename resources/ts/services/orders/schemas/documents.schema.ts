import { string, type Input, object } from "@vigilio/valibot";

export const documentsSchema = object({
	code: string(),
	name: string(),
});

export type DocumentsSchema = Input<typeof documentsSchema> & {
	createdAt?: Date;
	updatedAt?: Date;
};
