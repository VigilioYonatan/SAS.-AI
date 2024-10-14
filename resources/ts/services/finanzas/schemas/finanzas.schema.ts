import {
    coerce,
    date,
    maxLength,
    minLength,
    minValue,
    number,
    object,
    string,
    type Input,
} from "@vigilio/valibot";
import { CategoriesFinanzasSchemaFromServer } from "./tipo.schema";

export const finanzasSchema = object({
    id: number(),
    date: coerce(date(), (value) => new Date(value as string)),
    presupuesto: number([minValue(0)]),
    monto: number([minValue(0)]),
    category_finanza_id: number(), //sueldo
    tipo_finanza_id: number(), //ingreso -egreso
    description: string([minLength(2), maxLength(20)]),
    empresa_id: number(),
});
export type FinanzasSchema = Input<typeof finanzasSchema>;
export type FinanzasSchemaFromServer = FinanzasSchema & {
    createdAt: Date;
    updatedAt: Date;
    categoriesFinanza: CategoriesFinanzasSchemaFromServer;
};
