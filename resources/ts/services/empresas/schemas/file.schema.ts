import { array, Input, number, object } from "@vigilio/valibot";
import { filesSchema } from "~/libs/upload";

export const fileSchema = object({
	id: number(),
	file: array(filesSchema()),
	empresa_id: number(),
});
export type FileSchema = Input<typeof fileSchema>;
