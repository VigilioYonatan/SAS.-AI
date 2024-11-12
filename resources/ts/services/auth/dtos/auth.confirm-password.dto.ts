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
	custom,
} from "@vigilio/valibot";
export const authRegisterDto = merge([
    pick(usersSchema, ["username", "name", "email", "password"]),
    object({
        repeat_password: string([
            minLength(6, "Este campo es obligatorio"),
            maxLength(36, "Este campo es obligatorio"),
            custom(
                (val) => /[a-zA-Z]/.test(val),
                "Deber tener por lo menos una letra."
            ),
            custom(
                (val) => /\d/.test(val),
                "Deber tener por lo menos un número."
            ),
        ]),
    }),
]);
export const authConfirmPasswordDto = merge([
    pick(authRegisterDto, ["password", "repeat_password"]),
    object({ user_id: number() }),
]);

export type AuthConfirmPasswordDto = Input<typeof authConfirmPasswordDto>;
