import { filesSchema } from "@/uploads/schemas/uploads.schema";
import {
    array,
    nullable,
    number,
    objectAsync,
    string,
    type Input,
} from "@vigilio/valibot";
import { backgroundQualities } from "../libs";

export const backgroundSchema = objectAsync({
    id: number(),
    image: array(filesSchema(backgroundQualities)),
    html: nullable(string()),
    empresa_id: number(),
});
export type BackgroundSchema = Input<typeof backgroundSchema>;
