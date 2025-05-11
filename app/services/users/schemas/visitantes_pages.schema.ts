import { type Input, number, objectAsync, string } from "@vigilio/valibot";

export const visitantesPagesSchema = objectAsync({
    id: number(),
    page: string(),
    time: number(),
    click: number(),
    scroll: number(),
    visit: number(),
    visitante_id: number(),
    empresa_id: number(),
});
export type VisitantesPagesSchema = Input<typeof visitantesPagesSchema>;
