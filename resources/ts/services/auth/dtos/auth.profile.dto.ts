import { usersSchema } from "@/users/schemas/users.schema";
import { type Input, pick } from "@vigilio/valibot";

export const authProfileDto = pick(usersSchema, [
    "name",
    "lastname",
    "address",
    "birthday",
    "address",
    "telephone",
    "enabledNotification",
]);

export type AuthProfileDto = Input<typeof authProfileDto>;
