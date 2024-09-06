import {
    number,
    string,
    type Input,
    object,
    minLength,
    maxLength,
} from "valibot";

export const floorsSchema = object({
    id: number(),
    name: string("Este campo es obligatorio.", [
        minLength(1, "Este campo es obligatorio"),
        maxLength(100, "Este campo requiere máximo 100 carácteres."),
    ]),
    empresa_id: number(),
});

export type FloorsSchema = Input<typeof floorsSchema> & {
    createdAt?: Date;
    updatedAt?: Date;
};
