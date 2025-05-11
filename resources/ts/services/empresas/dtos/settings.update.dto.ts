import {
    array,
    boolean,
    instance,
    mergeAsync,
    nullable,
    object,
    omitAsync,
    type Input,
} from "@vigilio/valibot";
import { settingsSchema } from "../schemas/settings.schema";
import validFileValibot from "~/libs/valibot";

export const settingsUpdateDto = mergeAsync([
    omitAsync(settingsSchema, [
        "id",
        "empresa_id",
        "host",
        "background_auth",
        "background_posts",
    ]),
    object({ isActive: boolean() }),
]);

export const settingsBackgrounAuthUpdateDto = object({
    background_auth: nullable(
        array(instance(File), "Este campo es obligatorio", [
            validFileValibot({
                required: false,
                min: 1,
                max: 1,
            }),
        ])
    ),
});
export const settingsBackgrounPostsUpdateDto = object({
    background_posts: nullable(
        array(instance(File), "Este campo es obligatorio", [
            validFileValibot({
                required: false,
                min: 1,
                max: 1,
            }),
        ])
    ),
});
export type SettingsUpdateDto = Input<typeof settingsUpdateDto>;
export type SettingsBackgrounAuthUpdateDto = Input<
    typeof settingsBackgrounAuthUpdateDto
>;
export type SettingsBackgrounPostsUpdateDto = Input<
    typeof settingsBackgrounPostsUpdateDto
>;
