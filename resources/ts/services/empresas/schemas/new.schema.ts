import {
	array,
	boolean,
	coerce,
	date,
	minLength,
	nullable,
	number,
	object,
	startsWith,
	string,
	type Input,
} from "@vigilio/valibot";
import { filesSchema } from "~/libs/upload";

export const newSchema = object({
	id: number(),
	title: string([minLength(1)]),
	subtitle: string([minLength(1)]),
	link: nullable(string([minLength(1), startsWith("http")])),
	enabled: boolean(),
	date: nullable(coerce(date(), (value) => new Date(value as string))),
	image: nullable(array(filesSchema())),
	empresa_id: number(),
});
export type NewSchema = Input<typeof newSchema>;
