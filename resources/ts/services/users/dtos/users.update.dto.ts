import { type Input, pick } from "@vigilio/valibot";
import { usersSchema } from "../schemas/users.schema";

export const usersUpdateDto = pick(usersSchema, [
	"specialty",
	"role_id",
	"enabled",
]);

export type UsersUpdateDto = Input<typeof usersUpdateDto>;
