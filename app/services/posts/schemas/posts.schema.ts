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
    nullable,
    coerce,
    date,
    boolean,
    object,
} from "@vigilio/valibot";
import { postsImageQualities } from "../libs";

export const postsSchema = objectAsync({
    id: number(),
    content: string([toTrimmed(), minLength(10)]),
    title: string([toTrimmed(), minLength(5), maxLength(255)]),
    seo_title: nullable(string([toTrimmed(), minLength(5), maxLength(255)])),
    likes: array(string()),
    image: array(filesSchema(postsImageQualities)),
    keywords: nullable(string([maxLength(255)])),
    date: coerce(date(), (val) => new Date(val as unknown as Date)),
    enabled: boolean(),
    links: array(
        object({
            title: string(),
            url: string(),
        })
    ),
    slug: nullable(string([toTrimmed(), minLength(5), maxLength(255)])),
    user_id: number(),
    empresa_id: number(),
});

export type PostsSchema = Input<typeof postsSchema> & {
    createdAt?: Date;
    updatedAt?: Date;
};
