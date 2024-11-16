import { usersSchema } from "@/users/schemas/users.schema";
import {
	pick,
	type Input,
	merge,
	object,
	string,
	minLength,
	custom,
} from "@vigilio/valibot";

export const authRegisterDto = merge([
	pick(usersSchema, [
		"username",
		"name",
		"telephone",
		"password",
		"empresa_id",
	]),
	object({
		repeat_password: string("Este campo es obligatorio", [
			minLength(1, "Este campo es obligatorio"),
			custom(
				(val) => /[a-zA-Z]/.test(val),
				"Deber tener por lo menos una letra.",
			),
			custom((val) => /\d/.test(val), "Deber tener por lo menos un número."),
		]),
	}),
]);
export type AuthRegisterDto = Input<typeof authRegisterDto>;
