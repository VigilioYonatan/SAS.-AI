import {
	type Input,
	number,
	object,
	string,
	minLength,
	toTrimmed,
	maxLength,
} from "@vigilio/valibot";

export const optionsSchema = object({
	id: number(),
	name: string([toTrimmed(), minLength(1), maxLength(45)]),
	type: number(),
});
export type OptionsSchema = Input<typeof optionsSchema>;
