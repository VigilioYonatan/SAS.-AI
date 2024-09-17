import {
	type Input,
	boolean,
	startsWith,
	number,
	minLength,
	object,
	maxLength,
	toTrimmed,
	string,
} from "@vigilio/valibot";

export const urlsSchema = object({
	id: number(),
	web: string([minLength(1), startsWith("https://")]),
	hash: string([toTrimmed(), minLength(1), minLength(3), maxLength(50)]),
	enabled: boolean(),
	empresa_id: number(),
});

export type UrlsSchema = Input<typeof urlsSchema>;
export type UrlsSchemaFromServer = UrlsSchema & {
	createdAt: Date;
	updatedAt: Date;
};
