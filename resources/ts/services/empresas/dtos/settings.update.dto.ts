import {
    array,
    instance,
    nullable,
    object,
    omitAsync,
    type Input,
} from "@vigilio/valibot";
import { settingsSchema } from "../schemas/settings.schema";
import validFileValibot from "~/libs/valibot";

export const settingsUpdateDto = omitAsync(settingsSchema, [
    "id",
    "empresa_id",
    "icon",
    "photo",
    "logo",
]);
export type SettingsUpdateDto = Input<typeof settingsUpdateDto>;
export const settingsLogoUpdateDto = object({
    logo: nullable(
        array(instance(File), "Este campo es obligatorio", [
            validFileValibot({
                required: false,
                min: 1,
                max: 1,
            }),
        ])
    ),
});

export const settingsIconUpdateDto = object({
    icon: nullable(
        array(instance(File), "Este campo es obligatorio", [
            validFileValibot({
                required: false,
                min: 1,
                max: 1,
            }),
        ])
    ),
});
export const settingsPhotoUpdateDto = object({
    photo: nullable(
        array(instance(File), "Este campo es obligatorio", [
            validFileValibot({
                required: false,
                min: 1,
                max: 1,
            }),
        ])
    ),
});

export type SettingsLogoUpdateDto = Input<typeof settingsLogoUpdateDto>;

export type SettingsIconUpdateDto = Input<typeof settingsIconUpdateDto>;
export type SettingsPhotoUpdateDto = Input<typeof settingsPhotoUpdateDto>;
