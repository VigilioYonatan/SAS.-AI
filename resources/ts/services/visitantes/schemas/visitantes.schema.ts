import { type Input, number, objectAsync, string } from "@vigilio/valibot";

export const visitantesSchema = objectAsync({
    id: number(),
    key: string(),
    ip: string(),
    browser: string(),
    os: string(),
    ubicacion: string(),
});
export type VisitantesSchema = Input<typeof visitantesSchema>;
