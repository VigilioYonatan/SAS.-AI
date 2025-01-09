import {
    any,
    array,
    boolean,
    Input,
    literal,
    maxLength,
    minLength,
    nullable,
    number,
    object,
    startsWith,
    string,
    toTrimmed,
    union,
} from "@vigilio/valibot";

export const crudSchema = object({
    id: number(),
    name: string([minLength(3), maxLength(30)]),
    slug: string([minLength(3), maxLength(30)]),
    icon: string([
        toTrimmed(),
        minLength(1),
        minLength(3),
        maxLength(200),
        startsWith("<i class=", "Icono no válido"),
    ]),
    data: array(
        object({
            name: string([minLength(3), maxLength(30)]),
            placeholder: nullable(string()),
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
                        literal("image-video"),
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
