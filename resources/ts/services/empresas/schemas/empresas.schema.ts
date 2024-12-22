import {
    type Input,
    number,
    minLength,
    array,
    string,
    object,
    startsWith,
    maxLength,
    nullable,
    boolean,
    toTrimmed,
    regex,
    coerce,
    date,
    minValue,
    maxValue,
    custom,
    email,
} from "@vigilio/valibot";
import { filesSchema } from "~/libs/upload";
import { AddressSchemaFromServer } from "./address.schema";
export const credentialsWeb = nullable(
    object({
        shopify: nullable(
            object({
                dominioweb: string(),
                apiKey: string(),
                password: string(),
            })
        ),
        woocommerce: nullable(
            object({
                consumerKey: string(),
                consumerSecret: string(),
            })
        ),
        prestashop: nullable(
            object({
                api_key: string(),
            })
        ),
    })
);
export type CredentialsWeb = Input<typeof credentialsWeb>;
export type Empresa = "normal" | "restaurant" | "servicio";

const payments = object({
    tienda: object({
        enabled: boolean(),
    }),
    mensual: object({
        date: nullable(coerce(date(), (value) => new Date(value as string))),
        enabled: boolean(),
    }),
    tokens: object({
        tokens: number("Solo numeros"),
    }),
    redes: object({
        date: nullable(coerce(date(), (value) => new Date(value as string))),
        enabled: boolean("Este campo es obligatorio"),
    }),
    facturacion: nullable(
        object({
            date: nullable(
                coerce(date(), (value) => new Date(value as string))
            ),
            enabled: boolean("Este campo es obligatorio"),
        })
    ),
    finanza: object({
        enabled: boolean(),
    }),
});
export type Payments = Input<typeof payments>;

export const whatsappconfig = object({
    enabled: string(),
    cerrado: string(),
    thank: string(),
    thank2: string(),
    sendpdf: string(),
});
export type Whatsappconfig = Input<typeof whatsappconfig>;
export const companySchema = object({
    ruc: string([toTrimmed(), regex(/^(10|20)\d{9}$/, "Ruc no válido")]),
    razonSocial: string([toTrimmed(), minLength(6)]),
    nombreComercial: string([toTrimmed(), minLength(6)]),
    sol_user: string([toTrimmed()]),
    sol_pass: string([toTrimmed()]),
    // only guia de remision
    client_id: nullable(string()),
    client_secret: nullable(string()),
    certificado_password: nullable(string()),
    production: boolean(),
});
export const scheduleSchema = object({
    id: number(),
    day: string([toTrimmed()]),
    openTime: string(),
    closeTime: string(),
    enabled: boolean(),
});
export const credentials = object({
    open_ai: string(),
});
export type Credentials = Input<typeof credentials>;
export const typeIA = [
    "Asistentes de Atención al Cliente",
    "Asistentes de Ventas y Marketing",
    "Asistentes de Entretenimiento",
];
export const inteligenceArtificial = object({
    nameIa: string(),
    timer: object({
        start: number(),
        finish: number(),
    }),
    type: string(),
    memory: number([
        minValue(3),
        maxValue(21),
        custom((val) => val % 2 !== 0, "Solo debe ser numeros impares."),
    ]),
    datos: array(string()),
    hour_update: number([minValue(6, "Minimo 6")]),
    usage: object({ input_tokens: number(), output_tokens: number() }),
    enabledBotInteligence: boolean(), // usará toda la base de datos. sino filtará los productos que el cliente busca , pero no es muy precioso por que el cliente puede escribir mal
    instructions: array(string([minLength(3)])),
    didactrices: array(string([minLength(3)])),
    otros: array(string()),
    isChunk: boolean(),
    settings: object({
        enabled_cart: boolean(),
        enabled_order: boolean(),
    }),
    max_length: number([minValue(100), maxValue(1000)]),
    try_to_sell: boolean(), //tratará de ofrecer y vender
    enabledHuman: boolean(),
    showAllProductsInformation: boolean(),
});

export type ScheduleSchema = Input<typeof scheduleSchema>;
export type InteligenceArtificial = Input<typeof inteligenceArtificial>;

export const contactsSchema = object({
    name: string(),
    telephone: string(),
    isFavorite: boolean(),
    ia: boolean(),
});
export const groupWhatsapp = object({
    name: string(),
    members: array(string()),
});

export type CompanySchema = Input<typeof companySchema>;
export type ContactsSchema = Input<typeof contactsSchema>;
export type GroupWhatsapp = Input<typeof groupWhatsapp>;
export const empresasSchema = object({
    id: number(),
    dial_code: string(),
    name_empresa: string([minLength(2), maxLength(100)]),
    web: nullable(string([startsWith("https://", "Web no válida. https://")])),
    email: nullable(string([email()])),
    about: nullable(string()), //  acerca de la empresa
    telephoneFirst: string([
        minLength(1),
        maxLength(30),
        custom(
            (value) => /^\d+$/.test(value),
            "Este campo solo permite números."
        ),
    ]), //obligatorio
    telephoneReclamos: nullable(
        string([
            minLength(1),
            maxLength(30),
            custom(
                (value) => /^\d+$/.test(value),
                "Este campo solo permite números."
            ),
        ])
    ),
    telephoneThird: nullable(
        string([
            minLength(1),
            maxLength(30),
            custom(
                (value) => /^\d+$/.test(value),
                "Este campo solo permite números."
            ),
        ])
    ),
    // urls
    facebook: nullable(
        string([
            startsWith(
                "https://www.facebook.com/",
                "Este campo debe comenzar con https://www.facebook.com/"
            ),
            maxLength(100),
        ])
    ),
    tiktok: nullable(
        string([
            startsWith(
                "https://www.tiktok.com/",
                "Este campo debe comenzar con https://www.tiktok.com/"
            ),
            maxLength(100),
        ])
    ),
    instagram: nullable(
        string([
            startsWith(
                "https://www.instagram.com/",
                "Este campo debe comenzar con https://www.instagram.com/"
            ),
            maxLength(100),
        ])
    ),
    twitter: nullable(
        string([
            startsWith(
                "https://www.twitter.com/",
                "Este campo debe comenzar con https://www.twitter.com/"
            ),
            maxLength(100),
        ])
    ),
    youtube: nullable(
        string([
            startsWith(
                "https://www.youtube.com/",
                "Este campo debe comenzar con https://www.youtube.com/"
            ),
            maxLength(100),
        ])
    ),
    logo: nullable(array(filesSchema())), //obligatorio
    logo_pwa: nullable(array(filesSchema())), //obligatorio
    company: nullable(companySchema), // informacion de compania para sunat
    enabled_igv: boolean(), // La tienda  pagará impuestos
    igv: number(),
    isOpen: boolean(), // La tienda esta cerrada
    enabledBot: boolean(), //obligatorio
    enabledBotWeb: boolean(), //obligatorio
    enabledSendSunat: boolean(), // cuando el cliente pague por las pasarelas se emitira a sunat
    dateRelease: coerce(date(), (value) => new Date(value as string)), // dia que se creo la web
    inteligenceArtificial, // ia
    enabledSendMessage: boolean(), // si esta activado el cliente  tendrá animaciones
    enabledClientPayComision: boolean(), // si esta activado el cliente de la empresa pagará comision en la pasarelas de pago
    yearFounded: coerce(date(), (value) => new Date(value as string)), // año de fundación de empresa
    contacts: array(contactsSchema), // array de contactos
    groupWhatsapp: array(groupWhatsapp), // array de grupos de whatsapp
    whatsappconfig, // configuracion whatsapp
    schedule: array(scheduleSchema), // horario de trabajo
    enabledAnimation: boolean(),
    map_marker: object(
        // mapa de la empresa del cliente ?
        { lng: number(), lat: number() },
        "Coordenadas no válida."
    ),
    enable_sell_country: boolean(),
    enable_map_marker: boolean(), // activar google maps. cliente pagará para activar
    enabled_booster: boolean(),
    twilio: object({ account: string(), token: string() }),
    // pasarela: string(),
    // auth
    payments,
    slug: string(),
    credentials,
    enabled_catalogo: boolean(),
    certificado: nullable(array(filesSchema())),
    type_empresa_id: number(),
    telegram_token: nullable(string()),
    type_empresa_other: nullable(string()),
    bancos: array(
        object({
            key: string(),
            value: string(),
            image: string(),
        })
    ),
    money: object({
        money: string(),
        international_simbolo: string(),
        simbolo: string(),
    }),
    port: number(),
    tipo_impuesto: string(),
    header_cart: nullable(string([minLength(10)])),
    mercado_pago_comision: object({
        comision: number(),
        url: string(),
        transaccion: nullable(number()),
    }),
    enabledSound: boolean(),
    timeWhatsapp: coerce(date(), (value) => new Date(value as string)),
    tz: string(),
    impuestos: array(number()),
    whatsapp_mode: object({
        type: string(),
        ip: nullable(
            string([
                custom(
                    (val) =>
                        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
                            val
                        ),
                    "Ip no valido"
                ),
            ])
        ),
        password: nullable(string([minLength(4), maxLength(30)])),
        memory: nullable(
            string([custom((val) => Number(val) >= 2, "Mínimo 2.")])
        ),
        cpu: nullable(string([custom((val) => Number(val) >= 2, "Mínimo 2.")])),
        date: nullable(coerce(date(), (value) => new Date(value as string))),
    }),
    facebook_pixel: nullable(
        string([
            custom(
                (val) => /^[0-9]{15,16}$/.test(val),
                "Facebook Pixel no válido"
            ),
        ])
    ),
    google_tag_manager: nullable(
        string([
            custom(
                (val) => /^GTM-[A-Z0-9]{6,7}$/.test(val),
                "Google Tag Manger no válido"
            ),
        ])
    ),
    tiktok_pixel: nullable(
        string([
            custom(
                (val) => /^[0-9]{16,20}$/.test(val),
                "Tik Tok pixel no válido"
            ),
        ])
    ),
    linkedin_tag: nullable(
        string([
            custom(
                (val) => /^[0-9]{9,12}$/.test(val),
                "LinkedIn Tag no válido"
            ),
        ])
    ),
    enabled_address: boolean(),
    isFreeVPS: boolean(),
    isTemplate: boolean(), // es template
    icon: nullable(array(filesSchema())),
    enabled_commentario_ia: boolean(),
    token: string(),
    enabled_dni_cart: boolean(),
    versionamiento: string(),
    isDolar: boolean(),
    zoho: object({
        email: nullable(string([email()])),
        password: nullable(string([minLength(3), maxLength(100)])),
        account_id: nullable(string()),
        client_id: nullable(string()),
        client_secret: nullable(string()),
        refresh_token: nullable(string()),
    }),
    enabled_zoho_mail: boolean(),
});

export type EmpresasSchema = Input<typeof empresasSchema> & {
    createdAt?: Date;
    updatedAt?: Date;
};
export type EmpresasEntitySchema = Omit<
    EmpresasSchema,
    "id" | "createdAt" | "updatedAt"
> & { address: AddressSchemaFromServer };
export type EmpresasSchemaFromServer = Omit<EmpresasSchema, "groupWhatsapp"> & {
    company: {
        ruc: Pick<
            CompanySchema,
            "ruc" | "razonSocial" | "nombreComercial" | "production"
        >;
    };
};
