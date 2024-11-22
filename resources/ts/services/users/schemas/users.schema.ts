import { slug } from "@vigilio/express-core/helpers";
import {
    type Input,
    number,
    minLength,
    email,
    maxLength,
    string,
    array,
    boolean,
    date,
    coerce,
    nullable,
    transform,
    toTrimmed,
    object,
    custom,
} from "@vigilio/valibot";
import { filesSchema } from "~/libs/upload";

export const subscription = object({
    endpoint: string(),
    keys: object({ p256dh: string(), auth: string() }),
});
export type Subscription = Input<typeof subscription>;
export const usersSchema = object({
    id: number(),
    user_code: string(),
    identification_number: nullable(string("Documento de identidad no válido")),
    username: string([toTrimmed(), minLength(1), minLength(6), maxLength(30)]),
    name: string([toTrimmed(), minLength(1), minLength(3), maxLength(30)]),
    lastname: nullable(string([toTrimmed(), minLength(3), maxLength(60)])),
    birthday: nullable(coerce(date(), (value) => new Date(value as string))),
    email: nullable(
        string([toTrimmed(), minLength(1), email(), maxLength(100)])
    ),
    password: string([
        toTrimmed(),
        minLength(1),
        minLength(6),
        maxLength(30),
        custom(
            (val) => /[a-zA-Z]/.test(val),
            "Deber tener por lo menos una letra."
        ),
        custom((val) => /\d/.test(val), "Deber tener por lo menos un número."),
    ]),
    address: nullable(string([toTrimmed(), minLength(10), maxLength(100)])),
    telephone: string([
        toTrimmed(),
        minLength(6),
        custom(
            (value) => /^\d+$/.test(value),
            "Este campo solo permite números."
        ),
    ]),
    reference: nullable(string([minLength(10), maxLength(100)])),
    photo: nullable(array(filesSchema())),
    speciality: nullable(string()),
    enabled: boolean(),
    isOnline: boolean(),
    slug: transform(
        string([toTrimmed(), minLength(1), minLength(3), maxLength(30)]),
        slug
    ),
    token: nullable(string()),
    role_id: number(),
    empresa_id: number(),
    subscription: nullable(subscription),
    buys: nullable(
        array(
            object({
                title: string(),
                date: nullable(coerce(date(), (val) => new Date(val as Date))),
                order: string(),
            })
        )
    ),
    enabledNotification: nullable(boolean()),
    isBot: boolean(),
    city_id: nullable(number()),
});

export type UsersSchema = Input<typeof usersSchema> & {
    updatedAt?: Date;
    createdAt?: Date;
};
export type UsersSchemaFromServer = UsersSchema & {
    createdAt?: Date;
    updatedAt?: Date;
};
