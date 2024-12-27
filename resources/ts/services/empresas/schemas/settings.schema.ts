import { CitiesSchemaFromServer } from "@/ubigeo/schemas/cities.schema";
import {
    array,
    boolean,
    coerce,
    custom,
    date,
    literal,
    maxLength,
    minLength,
    nullable,
    number,
    object,
    string,
    union,
    type Input,
} from "@vigilio/valibot";
import { filesSchema } from "~/libs/upload";
import { storageEmpresa } from "../stores/empresa.store";
import enviroments from "~/config";

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
    bg_color_header: string([minLength(2), maxLength(20)]),
    bg_color_aside: string([minLength(2), maxLength(20)]),
    bg_color_background: string(),
    is_subcategory: boolean(),
    is_service_page: boolean(),

    background_position: union(
        [literal("center"), literal("start"), literal("end")],
        "position no válido"
    ),
    background_type: union(
        [literal("first"), literal("second")],
        "Tipo de Background no válido"
    ),
    bg_color_paper: string(),
    type_border: union(
        [literal("circle"), literal("square")],
        "Border no válido"
    ),
    font_face: union(
        [literal("Barlow"), literal("Exo"), literal("Poppins")],
        "fuente no válido"
    ),
    type_cart: union(
        [
            literal("fas fa-shopping-cart"),
            literal("fas fa-shopping-bag"),
            literal("fas fa-shopping-basket"),
        ],
        "Border no válido"
    ),
    isCoverImage: boolean(),
    isScrolling: boolean(),

    isDark: boolean(),
    isLogoImage: boolean(),
    empresa_id: number(),
    hamburger: string([
        custom((val) => hamburgers.includes(val), "Hamburguesa no válida"),
    ]),
    position_header: boolean(),
    border_title_type: union(
        [
            literal("normal"),
            literal("circle"),
            literal("border"),
            literal("null"),
        ],
        "Icono Pack no válido"
    ),
    type_icons: union(
        [
            literal("normal"),
            literal("icons"),
            literal("premium"),
            literal("premium2"),
            literal("premium3"),
            literal("animation"),
        ],
        "Icono Pack no válido"
    ),

    shows: object({
        map: boolean(),
        about: boolean(),
        cards: boolean(),
        android: boolean(),
        brands: boolean(),
        categories_slider: boolean(),
        offers_section: boolean(),
        offers_user: boolean(),
    }),
    type_map: union(
        [literal("normal"), literal("satelite"), literal("secondary")],
        "Mapa no válido"
    ),
    type_star: union(
        [literal("heart"), literal("star")],
        "Tipo de estrella no válido"
    ),
    header_type: union(
        [literal("normal"), literal("search"), literal("transparent")],
        "Tipo de header no válido"
    ),
    logo_width: number(),
    type_card: union(
        [literal("normal"), literal("eccomerce")],
        "Tipo de card no válido"
    ),
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
    type_product_buttons: union([literal("first"), literal("second")]),
    is_hover_product: boolean(),
    is_hidde_total_cart: boolean(),
    type_icons_bars: union(
        [literal("normal"), literal("light")],
        "Tipo de icono no válido"
    ),
    type_arrow: union(
        [literal("first"), literal("second"), literal("third")],
        "Tipo de arrows no válido"
    ),
    isProductWallpaper: boolean(),
    products_limit: number(),
    products_limit_offer: number(),
});
export type SettingsSchema = Input<typeof settingsSchema>;

export type SettingsSchemaFromServer = SettingsSchema & {
    city: CitiesSchemaFromServer;
};

export const typeIcon1 =
    storageEmpresa?.setting.type_icons_bars === "normal" ? "s" : "r";
export const iconCart = enviroments.TYPE_CART.replace(
    "fas",
    storageEmpresa?.setting.type_icons_bars === "normal" ? "fas" : "far"
);
