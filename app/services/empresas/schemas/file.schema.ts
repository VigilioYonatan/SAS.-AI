import { filesSchema } from "@/uploads/schemas/uploads.schema";
import { array, number, objectAsync, type Input } from "@vigilio/valibot";

export const fileSchema = objectAsync({
	id: number(),
	file: array(filesSchema([100, 1000])),
	empresa_id: number(),
});
export type FileSchema = Input<typeof fileSchema>;
