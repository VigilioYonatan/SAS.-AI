import { type Input, pick } from "@vigilio/valibot";
import { usersSchema } from "../schemas/users.schema";

export const usersUpdateDto = pick(usersSchema, [
	"role_id",
	"enabled",
	"speciality",
	"isBot",
]);

export type UsersUpdateDto = Input<typeof usersUpdateDto>;
