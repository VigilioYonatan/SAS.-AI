import { CitiesSchemaFromServer } from "@/ubigeo/schemas/cities.schema";
import {
    array,
    boolean,
    coerce,
    custom,
    date,
    maxLength,
    minLength,
    nullable,
    number,
    object,
    string,
    type Input,
} from "@vigilio/valibot";
import { filesSchema } from "~/libs/upload";

export const hamburgers = [
    "fas fa-pizza-slice",
    "fas fa-soup",
    "fas fa-car",
    "fas fa-utensils-alt",
    "fas fa-gamepad-alt",
    "fas fa-hamburger",
    "fas fa-bars",
];
export const hostSchema = object({
    host: nullable(
        string([
            custom((val) => !val.startsWith("https://www"), "URL: empresa.com"),
            custom((val) => !val.startsWith("www."), "URL: empresa.com"),
            custom((val) => !val.endsWith("/"), "URL: empresa.com"),
        ])
    ),
    nameserver_one: nullable(string()),
    nameserver_two: nullable(string()),
    time: nullable(coerce(date(), (value) => new Date(value as string))),
    enabled: boolean(),
});
export const settingsSchema = object({
    id: number(),
    host: hostSchema,
    bg_color: string([minLength(2), maxLength(20)]),
    bg_color_responsive: string([minLength(2), maxLength(20)]),
    bg_color_secondary: string(),
    bg_color_footer: string(),
    bg_color_button: string(),
    bg_color_background: string(),
    is_subcategory: boolean(),
    background_position: string([
        custom(
            (val) => ["center", "start", "end"].includes(val),
            "position no válido"
        ),
    ]),
    background_type: string([
        custom(
            (val) => ["first", "second"].includes(val),
            "Tipo de Background no válido"
        ),
    ]),
    bg_color_paper: string(),
    type_border: string([
        custom((val) => ["circle", "square"].includes(val), "Border no válido"),
    ]),
    font_face: string([
        custom(
            (val) => ["Barlow", "Exo", "Poppins"].includes(val),
            "fuente no válido"
        ),
    ]),
    type_cart: string([
        custom(
            (val) =>
                [
                    "fas fa-shopping-cart",
                    "fas fa-shopping-bag",
                    "fas fa-shopping-basket",
                ].includes(val),
            "Border no válido"
        ),
    ]),
    isCoverImage: boolean(),
    isScrolling: boolean(),

    isDark: boolean(),
    isLogoImage: boolean(),
    empresa_id: number(),
    hamburger: string([
        custom((val) => hamburgers.includes(val), "Hamburguesa no válida"),
    ]),
    position_header: boolean(),
    border_title_type: string(),
    type_icons: string([
        custom(
            (val) =>
                [
                    "normal",
                    "icons",
                    "premium",
                    "premium2",
                    "premium3",
                    "animation",
                ].includes(val),
            "Icono Pack no válido"
        ),
    ]),

    shows: object({
        map: boolean(),
        about: boolean(),
        cards: boolean(),
        android: boolean(),
        brands: boolean(),
        offers_section: boolean(),
        offers_user: boolean(),
    }),
    type_map: string([
        custom(
            (val) => ["normal", "satelite", "secondary"].includes(val),
            "Mapa no válido"
        ),
    ]),
    type_star: string([
        custom(
            (val) => ["heart", "star"].includes(val),
            "Tipo de estrella no válido"
        ),
    ]),
    header_type: string([
        custom(
            (val) => ["normal", "search", "transparent"].includes(val),
            "Tipo de header no válido"
        ),
    ]),
    logo_width: number(),
    type_card: string([
        custom(
            (val) => ["normal", "eccomerce"].includes(val),
            "card no válido"
        ),
    ]),
    header_position: object({
        logo: number(),
        navbar: number(),
        icons: number(),
    }),
    is_block_aside: boolean(),
    header: object({
        home: boolean(),
        shop: boolean(),
        profile: boolean(),
        about: boolean(),
        pedidos: boolean(),
        condiciones: boolean(),
        categories: boolean(),
        subcategories: boolean(),
        services: boolean(),
    }),
    type_animation: string(),
    background_auth: array(filesSchema()),
    web_script: nullable(string()),
    type_product_buttons: string([
        custom((val) => ["first", "second"].includes(val)),
    ]),
    is_hover_product: boolean(),
    is_hidde_total_cart: boolean(),
    type_icons_bars: string([
        custom(
            (val) => ["normal", "light", ""].includes(val),
            "Tipo de icono no válido"
        ),
    ]),
    // position_map: string([
    //     custom(
    //         (val) => ["start", "end"].includes(val),
    //         "Posición de mapa no válido"
    //     ),
    // ]),
});
export type SettingsSchema = Input<typeof settingsSchema>;
export type SettingsSchemaFromServer = SettingsSchema & {
    city: CitiesSchemaFromServer;
};
