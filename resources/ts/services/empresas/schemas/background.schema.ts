import {
    array,
    nullable,
    number,
    object,
    string,
    type Input,
} from "@vigilio/valibot";
import { filesSchema } from "~/libs/upload";

export const backgroundSchema = object({
    id: number(),
    image: array(filesSchema()),
    html: nullable(string()),
    empresa_id: number(),
});
export type BackgroundSchema = Input<typeof backgroundSchema>;
export type BackgroundSchemaFromServer = BackgroundSchema & {
    createdAt: Date;
    updatedAt: Date;
};
