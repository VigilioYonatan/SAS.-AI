import { filesSchema } from "@/uploads/schemas/uploads.schema";
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
    objectAsync,
    string,
    type Input,
} from "@vigilio/valibot";
const hamrguers = [
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
export const settingsSchema = objectAsync({
    id: number(),
    host: hostSchema,
    bg_color: string([minLength(2), maxLength(20)]),
    bg_color_responsive: string([minLength(2), maxLength(20)]),
    bg_color_secondary: string(),
    bg_color_button: string(),
    isDark: boolean(),
    type_border: string([
        custom((val) => ["circle", "square"].includes(val), "Border no válido"),
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
    isLogoImage: boolean(),
    isScrolling: boolean(),
    bg_color_footer: string(),
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
    header_type: string([
        custom(
            (val) => ["normal", "search", "transparent"].includes(val),
            "Tipo de header no válido"
        ),
    ]),
    font_face: string([
        custom(
            (val) => ["Barlow", "Exo", "Poppins"].includes(val),
            "fuente no válido"
        ),
    ]),
    bg_color_background: string(),
    bg_color_paper: string(),
    logo_width: number(),
    type_icons_bars: string([
        custom(
            (val) => ["normal", "light", ""].includes(val),
            "Tipo de icono no válido"
        ),
    ]),
    hamburger: string([
        custom((val) => hamrguers.includes(val), "Hamburguesa no válida"),
    ]),
    type_star: string([
        custom(
            (val) => ["heart", "star"].includes(val),
            "Tipo de estrella no válido"
        ),
    ]),
    position_header: boolean(),
    empresa_id: number(),
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
        brands: boolean(),
        android: boolean(),
        offers_section: boolean(),
        offers_user: boolean(),
    }),
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
    header_position: object({
        logo: number(),
        navbar: number(),
        icons: number(),
    }),
    type_map: string([
        custom(
            (val) => ["normal", "satelite", "secondary"].includes(val),
            "Mapa no válido"
        ),
    ]),
    type_card: string([
        custom(
            (val) => ["normal", "eccomerce"].includes(val),
            "card no válido"
        ),
    ]),
    is_block_aside: boolean(),
    type_animation: string(),
    background_auth: nullable(array(filesSchema([100, 1600]))),
    web_script: nullable(string()),
    type_product_buttons: string([
        custom((val) => ["first", "second"].includes(val)),
    ]),
    is_hover_product: boolean(),
});
export type SettingsSchema = Input<typeof settingsSchema>;
