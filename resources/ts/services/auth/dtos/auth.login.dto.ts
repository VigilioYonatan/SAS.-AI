import { usersSchema } from "@/users/schemas/users.schema";
import {
    pick,
    type Input,
    merge,
    object,
    boolean,
    string,
    custom,
} from "@vigilio/valibot";

export const authLoginDto = merge([
    pick(usersSchema, ["password"]),
    object({
        rememberPassword: boolean(),
        telephone: string([
            custom(
                (val) => /^\d+$|^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
                "Este campo permite solo números o correo electrónico."
            ),
        ]),
    }),
]);
export type AuthLoginDto = Input<typeof authLoginDto>;
