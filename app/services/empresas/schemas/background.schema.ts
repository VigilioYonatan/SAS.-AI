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
    title: nullable(string([maxLength(40)])),
    description: nullable(string([maxLength(60)])),
    url: nullable(string([startsWith("http")])),
    html: nullable(string()),
    empresa_id: number(),
});
export type BackgroundSchema = Input<typeof backgroundSchema>;
