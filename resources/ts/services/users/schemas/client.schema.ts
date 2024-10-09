import { email } from "@vigilio/valibot";
import {
	type Input,
	number,
	minLength,
	maxLength,
	string,
	boolean,
	custom,
	nullable,
	toTrimmed,
	object,
} from "@vigilio/valibot";

export const clientsSchema = object({
	id: number(),
	fullname: nullable(string([toTrimmed(), minLength(3), maxLength(60)])),
	telephone: string([
		toTrimmed(),
		minLength(6),
		custom((value) => /^\d+$/.test(value), "Este campo solo permite números."),
	]),
	address: nullable(string([minLength(10), maxLength(100)])),
	reference: nullable(string([minLength(10), maxLength(100)])),
	city_id: nullable(number()),
	map_marker: nullable(
		object({ lng: number(), lat: number() }, "Coordenadas no válida."),
	),
	email: nullable(string([email()])),
	identification_number: nullable(string("Documento de identidad no válido")),
	enabled: boolean(),
	empresa_id: number(),
});

export type ClientsSchema = Input<typeof clientsSchema> & {
	updatedAt?: Date;
	createdAt?: Date;
};
export type ClientsSchemaFromServer = ClientsSchema & {
	updatedAt?: Date;
	createdAt?: Date;
};
