import { number, string, type Input, object } from "@vigilio/valibot";

export const ratingsSchema = object({
	id: number(),
	rating: number(),
	user_id: number(),
	ratingsable_id: number(),
	ratingsable_type: string(),
});
export type RatingsSchema = Input<typeof ratingsSchema>;
