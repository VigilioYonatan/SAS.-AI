import { Users } from "@/users/entities/users.entity";
import { usersSchema, type UsersSchema } from "@/users/schemas/users.schema";
import {
    type Input,
    object,
    string,
    minLength,
    mergeAsync,
    pickAsync,
    getPipeIssues,
    getOutput,
    custom,
} from "@vigilio/valibot";

export const authRegisterDto = mergeAsync(
    [
        pickAsync(usersSchema, [
            "username",
            "name",
            "telephone",
            "password",
            "empresa_id",
        ]),
        object({
            repeat_password: string([
                minLength(1, "Este campo es obligatorio"),
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
    ],
    [
        async (input) => {
            if (input.repeat_password !== input.password) {
                return getPipeIssues(
                    "repeat_password",
                    "Contraseñas no similares",
                    input
                );
            }
            const [byUser_name, byEmail] = await Promise.all([
                Users.findOne({
                    where: {
                        username: input.username,
                        empresa_id: input.empresa_id,
                    },
                    raw: true,
                }),
                Users.findOne({
                    where: {
                        telephone: input.telephone,
                        empresa_id: input.empresa_id,
                    },
                    raw: true,
                }),
            ]);

            if (byUser_name) {
                return getPipeIssues(
                    "username" as keyof UsersSchema,
                    `Ya existe un usuario con el nombre de usuario ${input.username}`,
                    input
                );
            }

            if (byEmail) {
                return getPipeIssues(
                    "telephone" as keyof UsersSchema,
                    `Ya existe un usuario con el telefono ${input.telephone}`,
                    input
                );
            }
            return getOutput(input);
        },
    ]
);
export type AuthRegisterDto = Input<typeof authRegisterDto>;
