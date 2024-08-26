import {
    boolean,
    coerce,
    date,
    minLength,
    nullable,
    number,
    objectAsync,
    startsWith,
    string,
    type Input,
} from "@vigilio/valibot";

export const newSchema = objectAsync({
    id: number(),
    title: string([minLength(1)]),
    subtitle: string([minLength(1)]),
    link: nullable(string([minLength(1), startsWith("http")])),
    enabled: boolean(),
    date: nullable(coerce(date(), (value) => new Date(value as string))),
    information_id: number(),
});
export type NewSchema = Input<typeof newSchema>;
