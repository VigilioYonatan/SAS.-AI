import {
	type Input,
	number,
	objectAsync,
	string,
	minLength,
	maxLength,
	toTrimmed,
} from "@vigilio/valibot";

export const commentsSchema = objectAsync({
	id: number(),
	content: string([toTrimmed(), minLength(1), minLength(3), maxLength(255)]),
	user_id: number(),
	commentsable_id: number(),
	commentsable_type: string(),
	empresa_id: number(),
});

export type CommentsSchema = Input<typeof commentsSchema> & {
	createdAt?: Date;
	updatedAt?: Date;
};
