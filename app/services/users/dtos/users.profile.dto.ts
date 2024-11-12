import { type Input, pickAsync } from "@vigilio/valibot";
import { usersSchema } from "../schemas/users.schema";

export const usersProfileDto = pickAsync(usersSchema, [
    "name",
    "address",
    "birthday",
    "lastname",
    "enabledNotification",
    "email",
    "speciality",
    "identification_number",
    "reference",
    "telephone",
]);
export type UsersProfileDto = Input<typeof usersProfileDto>;
