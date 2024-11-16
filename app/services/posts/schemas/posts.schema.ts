import { filesSchema } from "@/uploads/schemas/uploads.schema";
import {
	type Input,
	number,
	objectAsync,
	string,
	minLength,
	maxLength,
	array,
	toTrimmed,
} from "@vigilio/valibot";
import { postsImageQualities } from "../libs";

export const postsSchema = objectAsync({
	id: number(),
	content: string([toTrimmed(), minLength(10), maxLength(255)]),
	title: string([toTrimmed(), minLength(5), maxLength(255)]),
	likes: array(string()),
	image: array(filesSchema(postsImageQualities)),
	user_id: number(),
	empresa_id: number(),
});

export type PostsSchema = Input<typeof postsSchema> & {
	createdAt?: Date;
	updatedAt?: Date;
};
