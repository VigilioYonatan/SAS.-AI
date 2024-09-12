import { number, object, string, type Input } from "@vigilio/valibot";

export const informationSchema = object({
	id: number(),
	token: string(),
});

export type InformationSchema = Input<typeof informationSchema>;
export type InformationSchemaFromServer = InformationSchema & {
	createdAt: Date;
	updatedAt: Date;
};
