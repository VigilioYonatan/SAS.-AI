import {
    email,
    maxLength,
    minLength,
    number,
    objectAsync,
    string,
    toTrimmed,
    type Input,
} from "@vigilio/valibot";

export const emailsSchema = objectAsync({
    id: number(),
    name: string([toTrimmed(), minLength(3), maxLength(30)]),
    subject: string([toTrimmed(), minLength(4), maxLength(200)]),
    email: string([toTrimmed(), email()]),
    content: string([toTrimmed(), minLength(10), maxLength(200)]),
    empresa_id: number(),
});

export type EmailsSchema = Input<typeof emailsSchema>;
