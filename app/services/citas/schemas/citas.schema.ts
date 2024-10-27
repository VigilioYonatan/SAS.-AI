import { nullable, record } from "@vigilio/valibot";
import {
    coerce,
    custom,
    date,
    maxLength,
    minLength,
    number,
    objectAsync,
    string,
    type Input,
} from "@vigilio/valibot";

export const citasSchema = objectAsync({
    id: number(),
    telephone: string([
        minLength(1),
        maxLength(30),
        custom(
            (value) => /^\d+$/.test(value),
            "Este campo solo permite números."
        ),
    ]),
    time: coerce(date(), (value) => {
        return new Date(value as string);
    }),
    description: nullable(string([minLength(3), maxLength(200)])),
    answers: record(string(), string([minLength(2), maxLength(300)])),
    empresa_id: number(),
});
export type CitasSchema = Input<typeof citasSchema>;
