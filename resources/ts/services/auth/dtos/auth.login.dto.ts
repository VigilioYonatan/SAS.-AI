import { usersSchema } from "@/users/schemas/users.schema";
import { pick, type Input, merge, object, boolean } from "@vigilio/valibot";

export const authLoginDto = merge([
    pick(usersSchema, ["telephone", "password"]),
    object({ rememberPassword: boolean() }),
]);
export type AuthLoginDto = Input<typeof authLoginDto>;
