import enviroments from "~/config/enviroments.config";
import type { InformationSchema } from "../schemas/information.schema";

export async function informationSeeder(): Promise<
    Omit<InformationSchema, "id">
> {
    const am8 = "08:00";
    const pm8 = "22:00";

    return {
        money: {
            international_simbolo: "es-PE",
            money: "Sol Peruano",
            simbolo: "PEN",
        },
        name_empresa: "vigilio services",
        dial_code: "51",
        host: null,
        bg_color: "#117ACD",
        enable_sell_country: false,
        type_empresa_other: null,
        web: null,
        email: "yonatanvigilio@vigilio-services.com",
        telephoneFirst: "959884398",
        about: "this is a a about page",
        isOpen: true,
        company: {
            nombreComercial: "VigilioServices",
            ruc: "20706020638",
            razonSocial: "Vigilio Services S.A.C",
            production: false,
            sol_pass: "test",
            sol_user: "test",
            client_id: "client-test",
            client_secret: "client-secret",
            certificado_password: null,
        },
        slug: "vigilioservices1",
        certificado: null,
        enabledBot: true,
        facebook: null,
        instagram: null,
        logo: null,
        telephoneReclamos: null,
        telephoneThird: null,
        enabled_igv: true,
        igv: 18,
        credentials: {
            open_ai: "",
        },
        inteligenceArtificial: {
            didactrices: [
                "Habla siempre en español latino y trata de escribir poco",
                "Trata de escribir poco.",
                "No sugerirás ni promocionarás productos de otros proveedores.",
                "El 'uso de emojis' es permitido para darle más carácter a la comunicación, ideal para WhatsApp",
                "Recuerda, tu objetivo es ser persuasivo y amigable, pero siempre profesional.",
                "responde bonito en formato whatsapp chat",
            ],
            instructions: [
                "Si te pido el estado de pedido o orden  digitar el codigo ORD-.",
                "Si te pido el estado de pedido o orden  digitar el codigo ORD-.",
            ],
            otros: [],
            type: "Asistentes de Ventas y Marketing",
            datos: [],
            timer: { start: 8, finish: 20 },
            hour_update: 24,
            usage: { input_tokens: 0, output_tokens: 0 },
            nameIa: "Luna",
            enabledBotInteligence: true,
            memory: 9,
        },
        dateRelease: new Date(),
        yearFounded: new Date(2012),
        tiktok: null,
        twitter: null,
        youtube: null,
        contacts: [],
        schedule: [
            {
                id: 1,
                day: "Lunes",
                openTime: am8,
                closeTime: pm8,
            },
            {
                id: 2,
                day: "Martes",
                openTime: am8,
                closeTime: pm8,
            },
            {
                id: 3,
                day: "Miercoles",
                openTime: am8,
                closeTime: pm8,
            },
            {
                id: 4,
                day: "Jueves",
                openTime: am8,
                closeTime: pm8,
            },
            {
                id: 5,
                day: "Viernes",
                openTime: am8,
                closeTime: pm8,
            },
            {
                id: 6,
                day: "Sabado",
                openTime: am8,
                closeTime: pm8,
            },
            {
                id: 0,
                day: "Domingo",
                openTime: am8,
                closeTime: pm8,
            },
        ],
        groupWhatsapp: [],
        enabledSendSunat: true,
        enabledSendMessage: true,
        enabledAnimation: true,
        enabledClientPayComision: true,
        whatsappconfig: {
            enabled: "No estamos disponible este momento. Intentelo más tarde.",
            cerrado:
                "Cerrado. No estamos disponible este momento. Intentelo más tarde.",
            thank: "Muchas gracias por su compra, Su {COMPROBANTE} 😊.",
            thank2: "No olvides visitar nuestro sitio web: {URL} 😊 para tener más información de nuestros productos, como ofertas y novedades.",
            sendpdf:
                "Hola, Aqui {NAME_EMPRESA} le adyunta su {COMPROBANTE} 😊.",
        },
        icon: null,
        map_marker: { lat: -12.053221, lng: -77.044861 },
        enable_map_marker: false,
        enabled_catalogo: false,
        payments: {
            ia: { date: new Date(), enabled: true, price: 10, tokens: 1000000 },
            sunat: { date: new Date(), enabled: true, price: 25 },
            telegram: {
                date: new Date(),
                enabled: false,
                price: 35,
                tokens: 100000,
            },
            catalogo: { price: 0, enabled: true },
        },
        type_empresa_id: 1,
        credentials_web: null,
        bancos: [
            {
                key: "bcp",
                value: "BCP",
                image: `${enviroments.VITE_VIGILIO_WEB}/images/settings/others/bancos/bcp.png`,
            },
            {
                key: "interbank",
                value: "Interbank",
                image: `${enviroments.VITE_VIGILIO_WEB}/images/settings/others/bancos/interbank.png`,
            },
            {
                key: "bbva",
                value: "BBVA",
                image: `${enviroments.VITE_VIGILIO_WEB}/images/settings/others/bancos/bbva.png`,
            },
        ],
        telegram_token: null,
    };
}
