import { usersSchema } from "@/users/schemas/users.schema";
import { type Input, pick } from "@vigilio/valibot";

export const authForgotPasswordDto = pick(usersSchema, ["telephone"]);
export type AuthForgotPasswordDto = Input<typeof authForgotPasswordDto>;
