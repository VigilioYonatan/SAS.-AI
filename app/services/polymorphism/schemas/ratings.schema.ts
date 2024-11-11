import { number, objectAsync, string, type Input } from "@vigilio/valibot";

export const ratingsSchema = objectAsync({
	id: number(),
	rating: number(),
	user_id: number(),
	ratingsable_id: number(),
	ratingsable_type: string(),
	empresa_id: number(),
});
export type RatingsSchema = Input<typeof ratingsSchema>;
