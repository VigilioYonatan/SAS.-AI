import {
    type Input,
    omitAsync,
    getOutput,
    getPipeIssues,
} from "@vigilio/valibot";
import { Users } from "../entities/users.entity";
import { type UsersSchema, usersSchema } from "../schemas/users.schema";

export const usersStoreDto = omitAsync(
    usersSchema,
    ["id", "user_code", "isOnline", "subscription", "enabledNotification"],
    [
        async (input) => {
            const [byUser_name, byTelephone, byEmail, bySlug] =
                await Promise.all([
                    Users.findOne({
                        where: {
                            username: input.username,
                            information_id: input.information_id,
                        },
                        raw: true,
                    }),
                    Users.findOne({
                        where: {
                            telephone: input.telephone,
                        },
                        raw: true,
                    }),
                    Users.findOne({
                        where: {
                            email: input.email,
                            information_id: input.information_id,
                        },
                        raw: true,
                    }),
                    Users.findOne({
                        where: {
                            slug: input.slug,
                            information_id: input.information_id,
                        },
                        raw: true,
                    }),
                ]);

            if (byUser_name) {
                return getPipeIssues(
                    "username" as keyof UsersSchema,
                    `Ya existe un usuario con el username: ${input.dni} en tu empresa`,
                    input
                );
            }
            if (byTelephone) {
                return getPipeIssues(
                    "telephone" as keyof UsersSchema,
                    `Ya existe un usuario con el telefono: ${input.telephone}`,
                    input
                );
            }
            if (byEmail) {
                return getPipeIssues(
                    "email" as keyof UsersSchema,
                    `Ya existe un usuario con el email: ${input.email} en tu empresa`,
                    input
                );
            }

            if (bySlug) {
                return getPipeIssues(
                    "slug" as keyof UsersSchema,
                    `Ya existe un usuario con el slug: ${input.slug}`,
                    input
                );
            }
            return getOutput(input);
        },
    ]
);

export type UsersStoreDto = Input<typeof usersStoreDto>;
