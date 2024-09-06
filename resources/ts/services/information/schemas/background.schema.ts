import {
	array,
	maxLength,
	nullable,
	number,
	object,
	startsWith,
	string,
	type Input,
} from "@vigilio/valibot";
import { filesSchema } from "~/libs/upload";

export const backgroundSchema = object({
	id: number(),
	image: array(filesSchema()),
	title: string([maxLength(40)]),
	description: nullable(string([maxLength(60)])),
	url: string([startsWith("https")]),
	information_id: number(),
});
export type BackgroundSchema = Input<typeof backgroundSchema>;
export type BackgroundSchemaFromServer = BackgroundSchema & {
	createdAt: Date;
	updatedAt: Date;
};
