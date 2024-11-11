import {
	coerce,
	custom,
	date,
	maxLength,
	minLength,
	nullable,
	number,
	object,
	record,
	string,
	type Input,
} from "@vigilio/valibot";

export const citasSchema = object({
	id: number(),
	telephone: string([
		minLength(1),
		maxLength(30),
		custom((value) => /^\d+$/.test(value), "Este campo solo permite números."),
	]),
	description: nullable(string([minLength(3)])),
	hour: string(),
	date: coerce(date(), (val) => new Date(val as string)),
	answers: record(string(), string([minLength(2), maxLength(300)])),
	empresa_id: number(),
});
export type CitasSchema = Input<typeof citasSchema>;
