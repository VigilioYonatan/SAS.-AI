import { number, objectAsync, type Input, string } from "@vigilio/valibot";

export const statusOrdersSchema = objectAsync({
	id: number(),
	name: string(),
});

export type StatusOrdersSchema = Input<typeof statusOrdersSchema>;
export type StatusOrdersSchemaFromServer = StatusOrdersSchema & {
	createdAt: Date;
	updatedAt: Date;
};
