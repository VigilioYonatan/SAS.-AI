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

export const subcommentsSchema = object({
	id: number(),
	content: string([toTrimmed(), minLength(1), minLength(3), maxLength(255)]),
	user_id: number(),
	subcommentsable_id: number(),
	subcommentsable_type: string(),
	comment_id: number(),
	empresa_id: number(),
});

export type SubcommentsSchema = Input<typeof subcommentsSchema> & {
	createdAt?: Date;
	updatedAt?: Date;
};
export type SubcommentsSchemaFromServe = SubcommentsSchema & {
	user: Pick<UsersSchemaFromServer, "id" | "username" | "photo" | "role_id">;
	reactions: Pick<ReactionsSchema, "id" | "isLike" | "user_id">[];
};
