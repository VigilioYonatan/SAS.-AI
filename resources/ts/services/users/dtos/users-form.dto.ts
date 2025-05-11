import { type Input, omit } from "@vigilio/valibot";
import { usersFormSchema } from "../schemas/users-form.schema";

export const usersFormStoreDto = omit(usersFormSchema, ["id"]);
export type UsersFormStoreDto = Input<typeof usersFormStoreDto>;

export const usersFormUpdateDto = omit(usersFormSchema, ["id"]);
export type UsersFormUpdateDto = Input<typeof usersFormUpdateDto>;
