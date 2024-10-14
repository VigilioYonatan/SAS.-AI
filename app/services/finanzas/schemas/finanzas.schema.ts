import {
    coerce,
    date,
    maxLength,
    minValue,
    number,
    objectAsync,
    string,
    type Input,
} from "@vigilio/valibot";

export const finanzasSchema = objectAsync({
    id: number(),
    date: coerce(date(), (value) => new Date(value as string)),
    presupuesto: number([minValue(0)]),
    monto: number([minValue(0)]),
    description: string([maxLength(20)]),
    category_finanza_id: number(), //sueldo
    tipo_finanza_id: number(), //ingreso -egreso
    empresa_id: number(),
});
export type FinanzasSchema = Input<typeof finanzasSchema>;
