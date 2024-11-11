import { number, string, type Input, object, boolean } from "@vigilio/valibot";

export const reactionsSchema = object({
	id: number(),
	isLike: boolean(),
	user_id: number(),
	reactionsable_id: number(),
	reactionsable_type: string(),
	empresa_id: number(),
});

export type ReactionsSchema = Input<typeof reactionsSchema>;
