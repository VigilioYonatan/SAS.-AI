import { object } from "@vigilio/valibot";
import {
	type Input,
	number,
	string,
	array,
	coerce,
	date,
	minLength,
	minValue,
	maxValue,
	toTrimmed,
	maxLength,
} from "@vigilio/valibot";

export const couponsSchema = object({
	id: number(),
	coupon: string([toTrimmed(), minLength(6), maxLength(20)]),
	discount: number([minValue(0, "Minímo 0%."), maxValue(100, "Máximo 100%.")]),
	max_use: number([minValue(0), maxValue(100)]),
	date: coerce(date(), (value) => new Date(value as string)),
	categories: array(number(), [minLength(1)]),
	information_id: number(),
});
export type CouponsSchema = Input<typeof couponsSchema>;
export type CouponsSchemaFromServer = CouponsSchema & {
	createdAt?: Date;
	updatedAt?: Date;
	category: { id: number; name: string }[];
};
