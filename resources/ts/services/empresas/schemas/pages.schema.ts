import {
    maxLength,
    minLength,
    nullable,
    number,
    object,
    regex,
    startsWith,
    string,
    toTrimmed,
    type Input,
} from "@vigilio/valibot";

export const pagesSchema = object({
    id: number(),
    title: string([minLength(3), maxLength(50)]),
    icon: nullable(
        string([
            toTrimmed(),
            minLength(1),
            minLength(3),
            maxLength(200),
            startsWith("<i class=", "Icono no válido"),
        ])
    ),
    slug: string([minLength(3), maxLength(50), regex(/^[^\s]+$/)]),
    description: string(),
    empresa_id: number(),
});
export type PageSchema = Input<typeof pagesSchema>;
