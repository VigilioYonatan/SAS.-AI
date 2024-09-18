import {
	type Input,
	number,
	minLength,
	objectAsync,
	maxLength,
	string,
	boolean,
	custom,
	nullable,
	toTrimmed,
	object,
} from "@vigilio/valibot";

export const clientsSchema = objectAsync({
	id: number(),
	fullname: nullable(string([toTrimmed(), minLength(3), maxLength(60)])),
	telephone: string([
		toTrimmed(),
		minLength(6),
		custom((value) => /^\d+$/.test(value), "Solo numeros."),
	]),
	address: nullable(string([minLength(10), maxLength(100)])),
	city_id: nullable(number()),
	map_marker: nullable(
		object({ lng: number(), lat: number() }, "Coordenadas no válida."),
	),
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
