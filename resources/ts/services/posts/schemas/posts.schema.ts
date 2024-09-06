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
} from "@vigilio/valibot";
import { filesSchema } from "~/libs/upload";

export const postsSchema = object({
    id: number(),
    content: string([toTrimmed(), minLength(10), maxLength(255)]),
    title: string([toTrimmed(), minLength(5), maxLength(255)]),
    image: array(filesSchema()),
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
