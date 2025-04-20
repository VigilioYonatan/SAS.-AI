import {
    array,
    boolean,
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
import { filesSchema } from "~/libs/upload";

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
    isDinamic: boolean(),
    description: string(),
    keywords: nullable(string([minLength(3), maxLength(200)])),
    favicon: nullable(array(filesSchema())),
    ogg_favicon: nullable(array(filesSchema())),
    empresa_id: number(),
    enabledHeaderPage: boolean(),
});
export type PageSchema = Input<typeof pagesSchema>;
