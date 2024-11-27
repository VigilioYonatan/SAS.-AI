import type { UsersSchemaFromServer } from "@/users/schemas/users.schema";
import {
	type Input,
	number,
	string,
	minLength,
	maxLength,
	object,
	toTrimmed,
} from "@vigilio/valibot";
import type { ReactionsSchema } from "./reactions.schema";

export const commentsSchema = object({
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
export type CommentsSchemaFromServe = CommentsSchema & {
	user: Pick<UsersSchemaFromServer, "id" | "username" | "photo" | "role_id">;
	count: number;
	reactions: Pick<ReactionsSchema, "id" | "isLike" | "user_id">[];
};
