import {
	type Input,
	number,
	string,
	nullable,
	array,
	regex,
	toTrimmed,
	minLength,
	maxLength,
	custom,
	email,
	object,
} from "@vigilio/valibot";
import { filesSchema } from "~/libs/upload";

export const suppliersSchema = object({
	id: number(),
	supplier_code: string(),
	ruc: string([toTrimmed(), regex(/^(10|20)\d{9}$/, "Ruc no válido")]),
	razon_social: string([toTrimmed(), minLength(5), maxLength(255)]),
	activity: string([toTrimmed(), minLength(5), maxLength(100)]),
	address: string([toTrimmed(), minLength(5), maxLength(100)]),
	contact: nullable(string([toTrimmed(), minLength(5), maxLength(19)])),
	phone_one: string([
		toTrimmed(),
		minLength(9),
		maxLength(20),
		custom(
			(value) => /^[0-9]+$/.test(value),
			"Este campo permite solo números.",
		),
	]),
	phone_two: nullable(
		string([
			toTrimmed(),
			minLength(9),
			maxLength(20),
			custom(
				(value) => /^[0-9]+$/.test(value),
				"Este campo permite solo números.",
			),
		]),
	),
	email: string([email()]),
	email2: nullable(string([email()])),
	web: nullable(
		string([
			regex(
				/^(https?:\/\/)?[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}(\/\S*)?$/,
				"Web no válida",
			),
		]),
	),
	logo: nullable(array(filesSchema())),
});

export type SuppliersSchema = Input<typeof suppliersSchema> & {
	createdAt?: Date;
	updatedAt?: Date;
};
export type SuppliersSchemaFromServer = SuppliersSchema & {
	createdAt: Date;
	updatedAt: Date;
};
