import {
    email,
    type Input,
    minLength,
    nullable,
    number,
    objectAsync,
    string,
} from "@vigilio/valibot";

export const visitantesSchema = objectAsync({
    id: number(),
    name: nullable(string([minLength(3)])),
    email: nullable(string([email()])),
    telephone: nullable(string([minLength(6)])),
    key: string(),
    ip: string(),
    browser: string(),
    os: string(),
    ubicacion: string(),
    empresa_id: number(),
});
export type VisitantesSchema = Input<typeof visitantesSchema>;
