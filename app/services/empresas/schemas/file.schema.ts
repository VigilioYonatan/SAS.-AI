import { filesSchema } from "@/uploads/schemas/uploads.schema";
import { array, number, objectAsync, string } from "@vigilio/valibot";

export const fileSchema = objectAsync({
    file: array(filesSchema([100, 1000])),
    name: string(),
    empresa_id: number(),
});
