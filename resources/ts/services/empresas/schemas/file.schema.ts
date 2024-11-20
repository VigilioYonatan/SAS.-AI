import { array, number, object, string } from "@vigilio/valibot";
import { filesSchema } from "~/libs/upload";

export const fileSchema = object({
    file: array(filesSchema()),
    name: string(),
    empresa_id: number(),
});
