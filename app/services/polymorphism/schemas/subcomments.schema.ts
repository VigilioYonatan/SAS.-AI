import type { UsersSchemaFromServer } from "@/users/schemas/users.schema";
import {
	type Input,
	number,
	string,
	minLength,
	maxLength,
	objectAsync,
	toTrimmed,
} from "@vigilio/valibot";

export const subcommentsSchema = objectAsync({
	id: number(),
	content: string([toTrimmed(), minLength(1), minLength(8), maxLength(255)]),
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
};
