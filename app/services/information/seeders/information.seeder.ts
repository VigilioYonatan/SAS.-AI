import enviroments from "~/config/enviroments.config";
import type { InformationSchema } from "../schemas/information.schema";
import { NOW } from "~/libs/dayjs";

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
		web: null,
		logo: null,
		name_empresa: "vigilio services",
		dial_code: "51",
		enable_sell_country: false,
		type_empresa_other: null,
		enabled_booster: true,
		email: "yonatanvigilio@vigilio-services.com",
		telephoneFirst: "959884398",
		isOpen: true,
		enabledBotWeb: true,
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
		slug: "vigilioservices2",
		enabledBot: true,
		facebook: null,
		instagram: null,
		telephoneReclamos: null,
		telephoneThird: null,
		enabled_igv: true,
		igv: 18,
		credentials: {
			open_ai: "",
		},
		inteligenceArtificial: {
			didactrices: [
				"Trata de escribir poco.",
				"No sugerirás ni promocionarás productos de otros proveedores.",
				"El 'uso de emojis' es permitido para darle más carácter a la comunicación, ideal para WhatsApp",
				"Recuerda, tu objetivo es ser persuasivo y amigable, pero siempre profesional.",
				"responde bonito en formato whatsapp chat",
			],
			instructions: [
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
			settings: { enabled_cart: true, enabled_order: true },
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
			thank2:
				"No olvides visitar nuestro sitio web: {URL} 😊 para tener más información de nuestros productos, como ofertas y novedades.",
			sendpdf: "Hola, Aqui {NAME_EMPRESA} le adyunta su {COMPROBANTE} 😊.",
		},
		map_marker: { lat: -12.053221, lng: -77.044861 },
		enable_map_marker: false,
		enabled_catalogo: false,
		payments: {
			ia: {
				date: NOW().add(7, "day").toDate(),
				enabled: true,
				price: 10,
				tokens: 1000000,
			},
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
		port: 5001,
		mercado_pago_comision: { comision: 3.49, transaccion: 1, url: "" },
		pricing: { ia: 29, sunat: 34, telegram: 38 },
		tipo_impuesto: "igv",
		enabled_pwa: true,
		certificado: null,
	};
}

export async function informationSeeder2(): Promise<
	Omit<InformationSchema, "id">
> {
	const am8 = "08:00";
	const pm8 = "22:00";

	return {
		money: {
			international_simbolo: "es-MX",
			money: "Pesos Mexicanos",
			simbolo: "MXN",
		},
		name_empresa: "Tacos A",
		dial_code: "52",
		web: null,
		logo: null,
		enabledBotWeb: true,
		enable_sell_country: false,
		type_empresa_other: null,
		enabled_booster: true,
		email: "yonatanvigilio@vigilio-services.com",
		telephoneFirst: "959884398",
		isOpen: true,
		company: null,
		slug: "vigilio-services",
		enabledBot: true,
		facebook: null,
		instagram: null,
		telephoneReclamos: null,
		telephoneThird: null,
		enabled_igv: true,
		igv: 16,
		credentials: {
			open_ai: "",
		},
		inteligenceArtificial: {
			didactrices: [
				"Trata de escribir poco.",
				"No sugerirás ni promocionarás productos de otros proveedores.",
				"El 'uso de emojis' es permitido para darle más carácter a la comunicación, ideal para WhatsApp",
				"Recuerda, tu objetivo es ser persuasivo y amigable, pero siempre profesional.",
				"responde bonito en formato whatsapp chat",
			],
			instructions: [
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
			settings: { enabled_cart: true, enabled_order: true },
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
			thank2:
				"No olvides visitar nuestro sitio web: {URL} 😊 para tener más información de nuestros productos, como ofertas y novedades.",
			sendpdf: "Hola, Aqui {NAME_EMPRESA} le adyunta su {COMPROBANTE} 😊.",
		},
		map_marker: { lat: 19.4326, lng: -99.1332 },
		enable_map_marker: false,
		enabled_catalogo: false,
		payments: {
			ia: {
				date: NOW().add(7, "day").toDate(),
				enabled: true,
				price: 10,
				tokens: 1000000,
			},
			sunat: { date: new Date(), enabled: true, price: 25 },
			telegram: {
				date: new Date(),
				enabled: false,
				price: 35,
				tokens: 100000,
			},
			catalogo: { price: 0, enabled: true },
		},
		type_empresa_id: 22,
		credentials_web: null,
		bancos: [
			{
				key: "bbva",
				value: "BBVA",
				image: `${enviroments.VITE_VIGILIO_WEB}/images/settings/others/bancos/bbva.png`,
			},
			{
				key: "citibanamex",
				value: "Citibanamex",
				image: `${enviroments.VITE_VIGILIO_WEB}/images/settings/others/bancos/citibanamex.png`,
			},
			{
				key: "banco_santander",
				value: "Santander",
				image: `${enviroments.VITE_VIGILIO_WEB}/images/settings/others/bancos/santander.png`,
			},
		],
		telegram_token: null,
		port: 5001,
		mercado_pago_comision: {
			comision: 2.49,
			transaccion: 4,
			url: "https://www.mercadopago.com.mx/ayuda/33399",
		},
		pricing: { ia: 29, sunat: 34, telegram: 38 },
		tipo_impuesto: "IVA",
		enabled_pwa: true,
		certificado: null,
	};
}
