import {
    array,
    boolean,
    maxLength,
    minLength,
    nullable,
    number,
    object,
    objectAsync,
    regex,
    startsWith,
    string,
    toTrimmed,
    type Input,
} from "@vigilio/valibot";

export const pagesSchema = objectAsync({
    id: number(),
    title: string([minLength(3), maxLength(50)]),
    slug: string([minLength(3), maxLength(50)]),
    icon: nullable(
        string([
            toTrimmed(),
            minLength(1),
            minLength(3),
            maxLength(200),
            startsWith("<i class=", "Icono no válido"),
        ])
    ),
    queries: array(
        object({
            key: string([minLength(2), maxLength(20)]),
            query: string([
                minLength(3),
                regex(
                    /^SELECT.*:empresa_id.*/,
                    "consulta solo SELECT  y solo en máyusculas"
                ),
            ]),
        })
    ),
    description: string(),
    isDinamic: boolean(),
    enabledHeaderPage: boolean(),
    empresa_id: number(),
});
export type PageSchema = Input<typeof pagesSchema>;
