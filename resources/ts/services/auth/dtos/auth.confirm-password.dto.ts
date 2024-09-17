import { usersSchema } from "@/users/schemas/users.schema";
import {
	type Input,
	pick,
	merge,
	object,
	number,
	string,
	minLength,
	maxLength,
} from "@vigilio/valibot";
export const authRegisterDto = merge([
	pick(usersSchema, ["username", "name", "email", "password"]),
	object({
		repeat_password: string([
			minLength(6, "Este campo es obligatorio"),
			maxLength(36, "Este campo es obligatorio"),
		]),
	}),
]);
export const authConfirmPasswordDto = merge([
	pick(authRegisterDto, ["password", "repeat_password"]),
	object({ user_id: number() }),
]);

export type AuthConfirmPasswordDto = Input<typeof authConfirmPasswordDto>;
