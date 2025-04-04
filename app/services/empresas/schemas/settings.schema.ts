import { filesSchema } from "@/uploads/schemas/uploads.schema";
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
    objectAsync,
    string,
    union,
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

export const languagesUnion = union([
    literal("es"),
    literal("en"),
    literal("zh-CN"),
    literal("pt"),
    literal("it"),
    literal("tr"),
    literal("fr"),
    literal("zh-TW"),
    literal("ru"),
    literal("ar"),
    literal("sv"),
    literal("bg"),
    literal("xh"),
    literal("fy"),
    literal("sd"),
    literal("sn"),
    literal("gd"),
    literal("sm"),
    literal("ps"),
    literal("lb"),
    literal("ky"),
    literal("vi"),
    literal("az"),
    literal("sk"),
    literal("fa"),
    literal("mn"),
    literal("pl"),
    literal("ja"),
    literal("ro"),
    literal("ko"),
    literal("ka"),
    literal("cs"),
    literal("la"),
    literal("af"),
    literal("sq"),
    literal("tl"),
    literal("sr"),
    literal("id"),
    literal("hi"),
    literal("nl"),
]);
export type LanguagesUnion = Input<typeof languagesUnion>;
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
    bg_color_header: string([minLength(2), maxLength(20)]),
    bg_color_aside: string([minLength(2), maxLength(20)]),
    text_color: string([minLength(2), maxLength(20)]),
    bg_color_button: string(),
    isDark: boolean(),
    type_border: union(
        [literal("circle"), literal("square")],
        "Border no válido"
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
    isLogoImage: boolean(),
    isScrolling: boolean(),
    bg_color_footer: string(),
    is_service_page: boolean(),
    is_subcategory: boolean(),
    background_position: union(
        [literal("center"), literal("start"), literal("end")],
        "position no válido"
    ),
    background_type: union(
        [literal("first"), literal("second")],
        "Tipo de Background no válido"
    ),
    header_type: union(
        [
            literal("normal"),
            literal("search"),
            literal("search2"),
            literal("transparent"),
        ],
        "Tipo de header no válido"
    ),
    font_face: union(
        [literal("Barlow"), literal("Exo"), literal("Poppins")],
        "fuente no válido"
    ),
    bg_color_background: string(),
    bg_color_paper: string(),
    logo_width: number(),
    type_icons_bars: union(
        [literal("normal"), literal("light")],
        "Tipo de icono no válido"
    ),
    hamburger: string([
        custom((val) => hamrguers.includes(val), "Hamburguesa no válida"),
    ]),
    type_star: union(
        [literal("heart"), literal("star")],
        "Tipo de estrella no válido"
    ),
    position_header: boolean(),
    empresa_id: number(),
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
        brands: boolean(),
        android: boolean(),
        offers_section: boolean(),
        offers_user: boolean(),
        categories_slider: boolean(),
        users: boolean(),
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
    type_map: union(
        [literal("normal"), literal("satelite"), literal("secondary")],
        "Mapa no válido"
    ),
    type_loader: union(
        [
            literal("one"),
            literal("two"),
            literal("three"),
            literal("four"),
            literal("null"),
        ],
        "Type Loader no válido"
    ),
    type_card: union(
        [literal("normal"), literal("eccomerce")],
        "Tipo de card no válido"
    ),
    is_block_aside: boolean(),
    type_animation: string(),
    background_auth: nullable(array(filesSchema([100, 1600]))),
    web_script: nullable(string()),
    is_hidde_total_cart: boolean(),
    type_product_buttons: union([literal("first"), literal("second")]),
    is_hover_product: boolean(),
    isProductWallpaper: boolean(),
    type_arrow: union(
        [literal("first"), literal("second"), literal("third")],
        "Tipo de arrows no válido"
    ),
    products_limit: number(),
    products_limit_offer: number(),
    isEccomerce: boolean(),
    isLogin: boolean(),
    isCuota: boolean(),
    multi_lenguaje: nullable(
        object({
            type: union([
                literal("globe"),
                literal("normal"),
                literal("emergente"),
            ]),
            default: languagesUnion,
            languages: array(languagesUnion),
        })
    ),
});
export type SettingsSchema = Input<typeof settingsSchema>;
