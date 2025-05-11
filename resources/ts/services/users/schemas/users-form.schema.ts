import {
    email,
    Input,
    maxLength,
    minLength,
    number,
    object,
    string,
} from "@vigilio/valibot";

export const usersFormSchema = object({
    id: number(),
    name: string([minLength(3), maxLength(50)]),
    telephone: string([minLength(6), maxLength(100)]),
    email: string([email()]),
});
export type UsersFormSchema = Input<typeof usersFormSchema>;
