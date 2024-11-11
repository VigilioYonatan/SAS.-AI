import {
	number,
	objectAsync,
	string,
	type Input,
	boolean,
} from "@vigilio/valibot";

export const reactionsSchema = objectAsync({
	id: number(),
	isLike: boolean(),
	user_id: number(),
	reactionsable_id: number(),
	reactionsable_type: string(),
	empresa_id: number(),
});

export type ReactionsSchema = Input<typeof reactionsSchema>;
