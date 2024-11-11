import { usersSchema } from "@/users/schemas/users.schema";
import {
    pick,
    type Input,
    merge,
    object,
    string,
    minLength,
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
        ]),
    }),
]);
export type AuthRegisterDto = Input<typeof authRegisterDto>;
