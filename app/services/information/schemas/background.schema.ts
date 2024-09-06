import { filesSchema } from "@/uploads/schemas/uploads.schema";
import {
	array,
	maxLength,
	nullable,
	number,
	objectAsync,
	startsWith,
	string,
	type Input,
} from "@vigilio/valibot";
import { backgroundQualities } from "../libs";

export const backgroundSchema = objectAsync({
	id: number(),
	image: array(filesSchema(backgroundQualities)),
	title: string([maxLength(40)]),
	description: nullable(string([maxLength(60)])),
	url: string([startsWith("http")]),
	information_id: number(),
});
export type BackgroundSchema = Input<typeof backgroundSchema>;
