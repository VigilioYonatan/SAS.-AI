import { number, type Input, object, string } from "@vigilio/valibot";

export const payMethodsSchema = object({
	id: number(),
	name: string(),
});

export type PayMethodsSchema = Input<typeof payMethodsSchema>;
export type PayMethodsSchemaFromServer = PayMethodsSchema & {
	createdAt: Date;
	updatedAT: Date;
};
