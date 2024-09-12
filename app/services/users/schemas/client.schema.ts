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
} from "@vigilio/valibot";

export const clientsSchema = objectAsync({
	id: number(),
	fullname: nullable(string([toTrimmed(), minLength(3), maxLength(60)])),
	telephone: string([
		toTrimmed(),
		minLength(6),
		custom((value) => /^\d+$/.test(value), "Solo numeros."),
	]),
	enabled: boolean(),
	empresa_id: number(),
});

export type ClientSchema = Input<typeof clientsSchema> & {
	updatedAt?: Date;
	createdAt?: Date;
};
