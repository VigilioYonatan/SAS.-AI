import { type Input, pickAsync } from "@vigilio/valibot";
import { usersSchema } from "../schemas/users.schema";

export const usersProfileDto = pickAsync(usersSchema, [
    "name",
    "address",
    "birthday",
    "lastname",
    "telephone",
    "enabledNotification",
    "speciality",
]);
export type UsersProfileDto = Input<typeof usersProfileDto>;
