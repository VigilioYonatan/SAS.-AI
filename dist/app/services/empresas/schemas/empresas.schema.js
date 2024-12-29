"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.empresasSchema = exports.groupWhatsapp = exports.contactsSchema = exports.inteligenceArtificial = exports.typeIA = exports.credentials = exports.scheduleSchema = exports.companySchema = exports.whatsappconfig = exports.payments = void 0;
const uploads_schema_1 = require("@/uploads/schemas/uploads.schema");
const valibot_1 = require("@vigilio/valibot");
const libs_1 = require("../libs");
exports.payments = (0, valibot_1.objectAsync)({
    tienda: (0, valibot_1.object)({
        enabled: (0, valibot_1.boolean)(),
    }),
    mensual: (0, valibot_1.object)({
        date: (0, valibot_1.nullable)((0, valibot_1.coerce)((0, valibot_1.date)(), (value) => new Date(value))),
        enabled: (0, valibot_1.boolean)(),
    }),
    tokens: (0, valibot_1.object)({
        tokens: (0, valibot_1.number)("Solo numeros"),
    }),
    redes: (0, valibot_1.object)({
        date: (0, valibot_1.nullable)((0, valibot_1.coerce)((0, valibot_1.date)(), (value) => new Date(value))),
        enabled: (0, valibot_1.boolean)("Este campo es obligatorio"),
    }),
    facturacion: (0, valibot_1.nullable)((0, valibot_1.object)({
        date: (0, valibot_1.nullable)((0, valibot_1.coerce)((0, valibot_1.date)(), (value) => new Date(value))),
        enabled: (0, valibot_1.boolean)("Este campo es obligatorio"),
    })),
    finanza: (0, valibot_1.object)({
        enabled: (0, valibot_1.boolean)(),
    }),
});
exports.whatsappconfig = (0, valibot_1.objectAsync)({
    enabled: (0, valibot_1.string)(),
    cerrado: (0, valibot_1.string)(),
    thank: (0, valibot_1.string)(),
    thank2: (0, valibot_1.string)(),
    sendpdf: (0, valibot_1.string)(),
});
exports.companySchema = (0, valibot_1.objectAsync)({
    ruc: (0, valibot_1.string)([(0, valibot_1.toTrimmed)(), (0, valibot_1.regex)(/^(10|20)\d{9}$/, "Ruc no válido")]),
    razonSocial: (0, valibot_1.string)([
        (0, valibot_1.toTrimmed)(),
        (0, valibot_1.minLength)(3, "Este campo permite como mínimo 6 caracteres"),
    ]),
    nombreComercial: (0, valibot_1.string)([
        (0, valibot_1.toTrimmed)(),
        (0, valibot_1.minLength)(3, "Este campo permite como mínimo 6 caracteres"),
    ]),
    sol_user: (0, valibot_1.string)([(0, valibot_1.toTrimmed)()]),
    sol_pass: (0, valibot_1.string)([(0, valibot_1.toTrimmed)()]),
    client_id: (0, valibot_1.nullable)((0, valibot_1.string)()),
    client_secret: (0, valibot_1.nullable)((0, valibot_1.string)()),
    certificado_password: (0, valibot_1.nullable)((0, valibot_1.string)()),
    production: (0, valibot_1.boolean)(),
});
exports.scheduleSchema = (0, valibot_1.objectAsync)({
    id: (0, valibot_1.number)(),
    day: (0, valibot_1.string)([(0, valibot_1.toTrimmed)()]),
    openTime: (0, valibot_1.string)(),
    closeTime: (0, valibot_1.string)(),
    enabled: (0, valibot_1.boolean)(),
});
exports.credentials = (0, valibot_1.object)({
    open_ai: (0, valibot_1.string)(),
});
exports.typeIA = [
    "Asistentes de Atención al Cliente",
    "Asistentes de Ventas y Marketing",
    "Asistentes de Entretenimiento",
];
exports.inteligenceArtificial = (0, valibot_1.object)({
    nameIa: (0, valibot_1.string)(),
    timer: (0, valibot_1.object)({
        start: (0, valibot_1.number)(),
        finish: (0, valibot_1.number)(),
    }),
    type: (0, valibot_1.string)(),
    memory: (0, valibot_1.number)([
        (0, valibot_1.minValue)(3),
        (0, valibot_1.maxValue)(21),
        (0, valibot_1.custom)((val) => val % 2 !== 0, "Solo debe ser numeros impares."),
    ]),
    datos: (0, valibot_1.array)((0, valibot_1.string)()),
    hour_update: (0, valibot_1.number)([(0, valibot_1.minValue)(6, "Minimo 6")]),
    usage: (0, valibot_1.object)({ input_tokens: (0, valibot_1.number)(), output_tokens: (0, valibot_1.number)() }),
    enabledBotInteligence: (0, valibot_1.boolean)(),
    instructions: (0, valibot_1.array)((0, valibot_1.string)([(0, valibot_1.minLength)(3)])),
    didactrices: (0, valibot_1.array)((0, valibot_1.string)([(0, valibot_1.minLength)(3)])),
    isChunk: (0, valibot_1.boolean)(),
    otros: (0, valibot_1.array)((0, valibot_1.string)()),
    settings: (0, valibot_1.object)({
        enabled_cart: (0, valibot_1.boolean)(),
        enabled_order: (0, valibot_1.boolean)(),
    }),
    max_length: (0, valibot_1.number)([(0, valibot_1.minValue)(100), (0, valibot_1.maxValue)(1000)]),
    enabledHuman: (0, valibot_1.boolean)(),
    showAllProductsInformation: (0, valibot_1.boolean)(),
    try_to_sell: (0, valibot_1.boolean)(),
});
exports.contactsSchema = (0, valibot_1.objectAsync)({
    name: (0, valibot_1.string)(),
    telephone: (0, valibot_1.string)(),
    isFavorite: (0, valibot_1.boolean)(),
    ia: (0, valibot_1.boolean)(),
});
exports.groupWhatsapp = (0, valibot_1.objectAsync)({
    name: (0, valibot_1.string)(),
    members: (0, valibot_1.arrayAsync)((0, valibot_1.string)()),
});
exports.empresasSchema = (0, valibot_1.objectAsync)({
    id: (0, valibot_1.number)(),
    web: (0, valibot_1.nullable)((0, valibot_1.string)([(0, valibot_1.startsWith)("https://", "Web no válida. https://")])),
    dial_code: (0, valibot_1.string)(),
    name_empresa: (0, valibot_1.string)([(0, valibot_1.minLength)(2), (0, valibot_1.maxLength)(100)]),
    email: (0, valibot_1.nullable)((0, valibot_1.string)([(0, valibot_1.email)()])),
    zoho: (0, valibot_1.object)({
        email: (0, valibot_1.nullable)((0, valibot_1.string)([(0, valibot_1.email)()])),
        password: (0, valibot_1.nullable)((0, valibot_1.string)([(0, valibot_1.minLength)(3), (0, valibot_1.maxLength)(100)])),
        account_id: (0, valibot_1.nullable)((0, valibot_1.string)()),
        client_id: (0, valibot_1.nullable)((0, valibot_1.string)()),
        client_secret: (0, valibot_1.nullable)((0, valibot_1.string)()),
        refresh_token: (0, valibot_1.nullable)((0, valibot_1.string)()),
    }),
    about: (0, valibot_1.nullable)((0, valibot_1.string)()),
    logo: (0, valibot_1.nullable)((0, valibot_1.array)((0, uploads_schema_1.filesSchema)(libs_1.empresasLogoQualities))),
    logo_pwa: (0, valibot_1.nullable)((0, valibot_1.array)((0, uploads_schema_1.filesSchema)(libs_1.empresasLogoQualities))),
    telephoneFirst: (0, valibot_1.string)([
        (0, valibot_1.minLength)(1),
        (0, valibot_1.maxLength)(30),
        (0, valibot_1.custom)((value) => /^\d+$/.test(value), "Este campo solo permite números."),
    ]),
    telephoneReclamos: (0, valibot_1.nullable)((0, valibot_1.string)([
        (0, valibot_1.maxLength)(30),
        (0, valibot_1.custom)((value) => /^\d+$/.test(value), "Este campo solo permite números."),
    ])),
    telephoneThird: (0, valibot_1.nullable)((0, valibot_1.string)([
        (0, valibot_1.maxLength)(30),
        (0, valibot_1.custom)((value) => /^\d+$/.test(value), "Este campo solo permite números."),
    ])),
    facebook: (0, valibot_1.nullable)((0, valibot_1.string)([
        (0, valibot_1.startsWith)("https://www.facebook.com/", "Este campo debe empezar con https://www.facebook.com/"),
        (0, valibot_1.maxLength)(100),
    ])),
    tiktok: (0, valibot_1.nullable)((0, valibot_1.string)([
        (0, valibot_1.startsWith)("https://www.tiktok.com/", "Este campo debe empezar con https://www.tiktok.com/"),
        (0, valibot_1.maxLength)(100),
    ])),
    instagram: (0, valibot_1.nullable)((0, valibot_1.string)([
        (0, valibot_1.startsWith)("https://www.instagram.com/", "Este campo debe empezar con https://www.instagram.com/"),
        (0, valibot_1.maxLength)(100),
    ])),
    twitter: (0, valibot_1.nullable)((0, valibot_1.string)([
        (0, valibot_1.startsWith)("https://www.twitter.com/", "Este campo debe empezar con https://www.twitter.com/"),
        (0, valibot_1.maxLength)(100),
    ])),
    youtube: (0, valibot_1.nullable)((0, valibot_1.string)([
        (0, valibot_1.startsWith)("https://www.youtube.com/", "Este campo debe empezar con https://www.youtube.com/"),
        (0, valibot_1.maxLength)(100),
    ])),
    company: (0, valibot_1.nullableAsync)(exports.companySchema),
    enabled_igv: (0, valibot_1.boolean)(),
    impuestos: (0, valibot_1.array)((0, valibot_1.number)()),
    igv: (0, valibot_1.number)(),
    isOpen: (0, valibot_1.boolean)(),
    enabledBot: (0, valibot_1.boolean)(),
    enabledBotWeb: (0, valibot_1.boolean)(),
    enabled_booster: (0, valibot_1.boolean)(),
    enabledSendSunat: (0, valibot_1.boolean)(),
    enable_sell_country: (0, valibot_1.boolean)(),
    dateRelease: (0, valibot_1.coerce)((0, valibot_1.date)(), (value) => new Date(value)),
    inteligenceArtificial: exports.inteligenceArtificial,
    enabledSendMessage: (0, valibot_1.boolean)(),
    enabledClientPayComision: (0, valibot_1.boolean)(),
    yearFounded: (0, valibot_1.coerce)((0, valibot_1.date)(), (value) => new Date(value)),
    contacts: (0, valibot_1.arrayAsync)(exports.contactsSchema),
    groupWhatsapp: (0, valibot_1.arrayAsync)(exports.groupWhatsapp),
    timeWhatsapp: (0, valibot_1.coerce)((0, valibot_1.date)(), (value) => new Date(value)),
    whatsappconfig: exports.whatsappconfig,
    schedule: (0, valibot_1.arrayAsync)(exports.scheduleSchema),
    enabledAnimation: (0, valibot_1.boolean)(),
    map_marker: (0, valibot_1.object)({ lng: (0, valibot_1.number)(), lat: (0, valibot_1.number)() }, "Coordenadas no válida."),
    enable_map_marker: (0, valibot_1.boolean)(),
    payments: exports.payments,
    slug: (0, valibot_1.string)(),
    credentials: exports.credentials,
    enabled_catalogo: (0, valibot_1.boolean)(),
    enabledSound: (0, valibot_1.boolean)(),
    type_empresa_id: (0, valibot_1.number)(),
    type_empresa_other: (0, valibot_1.nullable)((0, valibot_1.string)()),
    telegram_token: (0, valibot_1.nullable)((0, valibot_1.string)([(0, valibot_1.maxLength)(100)])),
    bancos: (0, valibot_1.array)((0, valibot_1.object)({
        key: (0, valibot_1.string)(),
        value: (0, valibot_1.string)(),
        image: (0, valibot_1.string)(),
    })),
    money: (0, valibot_1.object)({
        money: (0, valibot_1.string)(),
        international_simbolo: (0, valibot_1.string)(),
        simbolo: (0, valibot_1.string)(),
    }),
    port: (0, valibot_1.number)(),
    header_cart: (0, valibot_1.nullable)((0, valibot_1.string)([(0, valibot_1.minLength)(10)])),
    tz: (0, valibot_1.string)(),
    tipo_impuesto: (0, valibot_1.string)(),
    mercado_pago_comision: (0, valibot_1.object)({
        comision: (0, valibot_1.number)(),
        url: (0, valibot_1.string)(),
        transaccion: (0, valibot_1.nullable)((0, valibot_1.number)()),
    }),
    certificado: (0, valibot_1.nullable)((0, valibot_1.array)((0, uploads_schema_1.filesSchema)())),
    whatsapp_mode: (0, valibot_1.object)({
        type: (0, valibot_1.string)(),
        ip: (0, valibot_1.nullable)((0, valibot_1.string)([
            (0, valibot_1.custom)((val) => /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(val), "Ip no valido"),
        ])),
        password: (0, valibot_1.nullable)((0, valibot_1.string)([(0, valibot_1.minLength)(4), (0, valibot_1.maxLength)(30)])),
        memory: (0, valibot_1.nullable)((0, valibot_1.string)([(0, valibot_1.custom)((val) => Number(val) >= 2, "Mínimo 2.")])),
        cpu: (0, valibot_1.nullable)((0, valibot_1.string)([(0, valibot_1.custom)((val) => Number(val) >= 2, "Mínimo 2.")])),
        date: (0, valibot_1.nullable)((0, valibot_1.coerce)((0, valibot_1.date)(), (value) => new Date(value))),
    }),
    enabled_address: (0, valibot_1.boolean)(),
    facebook_pixel: (0, valibot_1.nullable)((0, valibot_1.string)([
        (0, valibot_1.custom)((val) => /^[0-9]{15,16}$/.test(val), "Facebook Pixel no válido"),
    ])),
    google_tag_manager: (0, valibot_1.nullable)((0, valibot_1.string)([
        (0, valibot_1.custom)((val) => /^GTM-[A-Z0-9]{6,7}$/.test(val), "Google Tag Manger no válido"),
    ])),
    tiktok_pixel: (0, valibot_1.nullable)((0, valibot_1.string)([
        (0, valibot_1.custom)((val) => /^[0-9]{16,20}$/.test(val), "Tik Tok pixel no válido"),
    ])),
    linkedin_tag: (0, valibot_1.nullable)((0, valibot_1.string)([
        (0, valibot_1.custom)((val) => /^[0-9]{9,12}$/.test(val), "LinkedIn Tag no válido"),
    ])),
    isFreeVPS: (0, valibot_1.boolean)(),
    isTemplate: (0, valibot_1.boolean)(),
    icon: (0, valibot_1.nullable)((0, valibot_1.array)((0, uploads_schema_1.filesSchema)([100, 300]))),
    enabled_commentario_ia: (0, valibot_1.boolean)(),
    versionamiento: (0, valibot_1.string)(),
    enabled_dni_cart: (0, valibot_1.boolean)(),
    isDolar: (0, valibot_1.boolean)(),
    token: (0, valibot_1.string)(),
    enabled_zoho_mail: (0, valibot_1.boolean)(),
});
