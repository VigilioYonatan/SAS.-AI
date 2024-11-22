import {
    type Input,
    array,
    instance,
    merge,
    object,
    omit,
    nullable,
    string,
    toTrimmed,
    minLength,
    custom,
} from "@vigilio/valibot";
import { usersSchema } from "../schemas/users.schema";
import validFileValibot from "~/libs/valibot";

export const usersStoreDto = merge([
    omit(usersSchema, [
        "id",
        "user_code",
        "token",
        "isOnline",
        "photo",
        "subscription",
        "enabledNotification",
        "telephone",
        "isBot",
    ]),
    object({
        telephone: string([
            toTrimmed(),
            minLength(6),
            custom(
                (value) => /^\d+$/.test(value),
                "Este campo solo permite números."
            ),
        ]),
        photo: nullable(
            array(instance(File), [
                validFileValibot({
                    required: false,
                    min: 1,
                    max: 1,
                }),
            ])
        ),
    }),
]);

export type UsersStoreDto = Input<typeof usersStoreDto>;
