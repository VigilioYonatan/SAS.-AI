import type { UsersSchema } from "@/users/schemas/users.schema";
import {
    type Input,
    number,
    string,
    minLength,
    maxLength,
    array,
    object,
    toTrimmed,
    nullable,
    coerce,
    date,
    boolean,
} from "@vigilio/valibot";
import { filesSchema } from "~/libs/upload";

export const postsSchema = object({
    id: number(),
    content: string([toTrimmed(), minLength(10)]),
    title: string([toTrimmed(), minLength(5), maxLength(255)]),
    seo_title: nullable(string([toTrimmed(), minLength(5), maxLength(255)])),
    image: array(filesSchema()),
    likes: array(string()),
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
export type PostsSchemaFromServer = PostsSchema & {
    user: Pick<UsersSchema, "id" | "username" | "photo">;
};
