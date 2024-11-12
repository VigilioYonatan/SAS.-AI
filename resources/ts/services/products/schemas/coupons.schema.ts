import { object } from "@vigilio/valibot";
import {
    type Input,
    number,
    string,
    array,
    minLength,
    minValue,
    maxValue,
    toTrimmed,
    maxLength,
} from "@vigilio/valibot";
import { datetime } from "~/libs/valibot";

export const couponsSchema = object({
    id: number(),
    coupon: string([toTrimmed(), minLength(6), maxLength(20)]),
    discount: number([
        minValue(0, "Minímo 0%."),
        maxValue(100, "Máximo 100%."),
    ]),
    max_use: number([minValue(0), maxValue(100)]),
    date: datetime(),
    categories: array(number(), [minLength(1)]),
    empresa_id: number(),
});
export type CouponsSchema = Input<typeof couponsSchema>;
export type CouponsSchemaFromServer = CouponsSchema & {
    createdAt?: Date;
    updatedAt?: Date;
    category: { id: number; name: string }[];
};
