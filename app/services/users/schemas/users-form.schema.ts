import {
    email,
    type Input,
    maxLength,
    minLength,
    number,
    objectAsync,
    string,
} from "@vigilio/valibot";

export const usersFormSchema = objectAsync({
    id: number(),
    name: string([minLength(3), maxLength(50)]),
    telephone: string([minLength(6), maxLength(100)]),
    email: string([email()]),
    empresa_id: number(),
});
export type UsersFormSchema = Input<typeof usersFormSchema>;
