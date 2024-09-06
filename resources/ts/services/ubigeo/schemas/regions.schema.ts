import { number, object, string, type Input } from "@vigilio/valibot";

export const regionsSchema = object({
	id: string(),
	code: string(),
	name: string(),
	country_id: number(),
});

export type RegionsSchema = Input<typeof regionsSchema>;
export type RegionsSchemaFromServer = RegionsSchema & {
	createdAt: Date;
	updatedAt: Date;
	priceShipping: number;
	enabled: boolean;
	days: number;
};
