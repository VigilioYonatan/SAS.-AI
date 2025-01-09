import { slug } from "@vigilio/express-core/helpers";
import {
    array,
    type Input,
    maxLength,
    minLength,
    number,
    object,
    objectAsync,
    startsWith,
    string,
    toTrimmed,
    union,
    literal,
    boolean,
    any,
    nullable,
    transform,
} from "@vigilio/valibot";

export const crudSchema = objectAsync({
    id: number(),
    name: string([minLength(3), maxLength(30)]),
    icon: string([
        toTrimmed(),
        minLength(1),
        minLength(3),
        maxLength(200),
        startsWith("<i class=", "Icono no válido"),
    ]),
    slug: transform(string([minLength(3), maxLength(30)]), (val: string) =>
        slug(val)
    ),
    data: array(
        object({
            name: string([minLength(3), maxLength(30)]),
            type: union(
                [
                    literal("STRING"),
                    literal("TEXT"),
                    literal("INTEGER"),
                    literal("DECIMAL"),
                    literal("BOOLEAN"),
                    literal("DATE"),
                    literal("FILE"),
                    literal("FOREIGNKEY"),
                ],
                "type no válido"
            ),
            placeholder: nullable(string()),
            options: object({
                allowNull: boolean(),
                defaultValue: any(),
                unique: boolean(),
                references: nullable(string()),
                onUpdate: nullable(
                    union([literal("CASCADE"), literal("RESTRICT")])
                ),
                onDelete: nullable(
                    union([literal("CASCADE"), literal("SET NULL")])
                ),
            }),
            file_option: nullable(
                object({
                    multiple: boolean(),
                    max: number(),
                    types: string(),
                    type: union([
                        literal("image"),
                        literal("video"),
                        literal("file"),
                        literal("file-image"),
                    ]),
                })
            ),
        })
    ),
    isCreatePage: boolean(),
    isDynamicPage: boolean(),
    paginator: nullable(number()),
    empresa_id: number(),
});
export type CrudSchema = Input<typeof crudSchema>;
