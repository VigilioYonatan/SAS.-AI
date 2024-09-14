import { CitiesSchemaFromServer } from "@/ubigeo/schemas/cities.schema";
import {
    array,
    boolean,
    custom,
    maxLength,
    minLength,
    nullable,
    number,
    object,
    string,
    type Input,
} from "@vigilio/valibot";
import { filesSchema } from "~/libs/upload";

export const settingsSchema = object({
    id: number(),
    host: nullable(
        string([
            custom((val) => !val.startsWith("https://www"), "URL: empresa.com"),
            custom((val) => !val.endsWith("/"), "URL: empresa.com"),
        ])
    ),
    about: nullable(string()), //  acerca de la empresa
    bg_color: string([minLength(2), maxLength(10)]),
    bg_color_responsive: string([minLength(2), maxLength(10)]),
    type_border: string([
        custom((val) => ["circle", "square"].includes(val), "Border no válido"),
    ]),
    type_cart: string([
        custom(
            (val) =>
                [
                    "far fa-shopping-cart",
                    "far fa-shopping-bag",
                    "far fa-shopping-basket",
                ].includes(val),
            "Border no válido"
        ),
    ]),
    isCoverImage: boolean(),
    isScrolling: boolean(),
    icon: nullable(array(filesSchema())), //obligatorio
    photo: nullable(array(filesSchema())),
    isDark: boolean(),
    empresa_id: number(),
});
export type SettingsSchema = Input<typeof settingsSchema>;
export type SettingsSchemaFromServer = SettingsSchema & {
    city: CitiesSchemaFromServer;
};
