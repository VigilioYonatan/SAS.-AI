import { filesSchema } from "@/uploads/schemas/uploads.schema";
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
	objectAsync,
	arrayAsync,
	minValue,
	maxValue,
	custom,
	nullableAsync,
} from "@vigilio/valibot";
import type { AddressSchemaEntity } from "./address.schema";
import type { SettingsSchema } from "./settings.schema";
import { informationLogoQualities } from "../libs";

export type Empresa = "normal" | "restaurant" | "servicio";

export const payments = objectAsync({
	catalogo: object({ price: number(), enabled: boolean() }),
	ia: object({
		date: nullable(coerce(date(), (value) => new Date(value as string))),
		price: number("Este campo es obligatorio"),
		enabled: boolean("Este campo es obligatorio"),
		tokens: number("Solo numeros"),
	}),
	telegram: object({
		date: nullable(coerce(date(), (value) => new Date(value as string))),
		price: number("Este campo es obligatorio"),
		enabled: boolean("Este campo es obligatorio"),
		tokens: number("Solo numeros"),
	}),
	sunat: nullable(
		object({
			date: nullable(coerce(date(), (value) => new Date(value as string))),
			price: number("Este campo es obligatorio"),
			enabled: boolean("Este campo es obligatorio"),
		}),
	),
});
export type Payments = Input<typeof payments>;

export const whatsappconfig = objectAsync({
	enabled: string(),
	cerrado: string(),
	thank: string(),
	thank2: string(),
	sendpdf: string(),
});
export type Whatsappconfig = Input<typeof whatsappconfig>;
export const companySchema = objectAsync({
	ruc: string([toTrimmed(), regex(/^(10|20)\d{9}$/, "Ruc no válido")]),
	razonSocial: string([
		toTrimmed(),
		minLength(6, "Este campo permite como mínimo 6 caracteres"),
	]),
	nombreComercial: string([
		toTrimmed(),
		minLength(6, "Este campo permite como mínimo 6 caracteres"),
	]),
	sol_user: string([toTrimmed()]),
	sol_pass: string([toTrimmed()]),
	// only guia de remision
	client_id: nullable(string()),
	client_secret: nullable(string()),
	certificado_password: nullable(string()),
	production: boolean(),
});
export const scheduleSchema = objectAsync({
	id: number(),
	day: string([toTrimmed()]),
	openTime: string(),
	closeTime: string(),
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
	settings: object({
		enabled_cart: boolean(),
		enabled_order: boolean(),
	}),
});

export type ScheduleSchema = Input<typeof scheduleSchema>;
export type InteligenceArtificial = Input<typeof inteligenceArtificial>;

export const contactsSchema = objectAsync({
	name: string(),
	telephone: string(),
	isFavorite: boolean(),
	ia: boolean(),
});
export const groupWhatsapp = objectAsync({
	name: string(),
	members: arrayAsync(string()),
});

export type CompanySchema = Input<typeof companySchema>;
export type ContactsSchema = Input<typeof contactsSchema>;
export type GroupWhatsapp = Input<typeof groupWhatsapp>;
export const credentialsWeb = nullable(
	object({
		shopify: nullable(
			object({
				dominioweb: string(),
				apiKey: string(),
				password: string(),
			}),
		),
		woocommerce: nullable(
			object({
				consumerKey: string(),
				consumerSecret: string(),
			}),
		),
		prestashop: nullable(
			object({
				api_key: string(),
			}),
		),
	}),
);
export type CredentialsWeb = Input<typeof credentialsWeb>;
export const informationSchema = objectAsync({
	id: number(),
	web: nullable(string([startsWith("https://", "Web no válida. https://")])),
	dial_code: string(),
	name_empresa: string([minLength(2), maxLength(100)]),
	credentials_web: credentialsWeb,
	email: string(),
	logo: nullable(array(filesSchema(informationLogoQualities))), //obligatorio
	telephoneFirst: string([
		minLength(1),
		maxLength(30),
		custom((value) => /^\d+$/.test(value), "Solo numeros."),
	]), //obligatorio
	telephoneReclamos: nullable(
		string([
			maxLength(30),
			custom((value) => /^\d+$/.test(value), "Solo numeros."),
		]),
	),
	telephoneThird: nullable(
		string([
			maxLength(30),
			custom((value) => /^\d+$/.test(value), "Solo numeros."),
		]),
	),

	// urls
	facebook: nullable(
		string([
			startsWith(
				"https://www.facebook.com/",
				"Este campo debe empezar con https://www.facebook.com/",
			),
			maxLength(100),
		]),
	),
	tiktok: nullable(
		string([
			startsWith(
				"https://www.tiktok.com/",
				"Este campo debe empezar con https://www.tiktok.com/",
			),
			maxLength(100),
		]),
	),
	instagram: nullable(
		string([
			startsWith(
				"https://www.instagram.com/",
				"Este campo debe empezar con https://www.instagram.com/",
			),
			maxLength(100),
		]),
	),
	twitter: nullable(
		string([
			startsWith(
				"https://www.twitter.com/",
				"Este campo debe empezar con https://www.twitter.com/",
			),
			maxLength(100),
		]),
	),
	youtube: nullable(
		string([
			startsWith(
				"https://www.youtube.com/",
				"Este campo debe empezar con https://www.youtube.com/",
			),
			maxLength(100),
		]),
	),
	company: nullableAsync(companySchema), // informacion de compania para sunat
	enabled_igv: boolean(), // La tienda  pagará impuestos
	igv: number(),
	isOpen: boolean(), // La tienda esta cerrada
	enabledBot: boolean(), //obligatorio
	enabledBotWeb: boolean(), //obligatorio
	enabled_booster: boolean(), //obligatorio
	enabledSendSunat: boolean(), // cuando el cliente pague por las pasarelas se emitira a sunat
	enabled_pwa: boolean(),
	enable_sell_country: boolean(),
	dateRelease: coerce(date(), (value) => new Date(value as string)), // dia que se creo la web
	inteligenceArtificial, // ia
	enabledSendMessage: boolean(), // si esta activado el cliente  tendrá animaciones
	enabledClientPayComision: boolean(), // si esta activado el cliente de la empresa pagará comision en la pasarelas de pago
	yearFounded: coerce(date(), (value) => new Date(value as string)), // año de fundación de empresa
	contacts: arrayAsync(contactsSchema), // array de contactos
	groupWhatsapp: arrayAsync(groupWhatsapp), // array de grupos de whatsapp
	whatsappconfig, // configuracion whatsapp
	schedule: arrayAsync(scheduleSchema), // horario de trabajo
	enabledAnimation: boolean(),
	map_marker: object(
		// mapa de la empresa del cliente ?
		{ lng: number(), lat: number() },
		"Coordenadas no válida.",
	),
	enable_map_marker: boolean(), // activar google maps. cliente pagará para activar
	// pasarela: string(),
	// auth
	payments,
	slug: string(),
	credentials,
	enabled_catalogo: boolean(),
	type_empresa_id: number(),
	type_empresa_other: nullable(string()),
	telegram_token: nullable(string([maxLength(100)])),
	bancos: array(
		object({
			key: string(),
			value: string(),
			image: string(),
		}),
	),
	money: object({
		money: string(),
		international_simbolo: string(),
		simbolo: string(),
	}),
	port: number(),
	tipo_impuesto: string(),
	mercado_pago_comision: object({
		comision: number(),
		url: string(),
		transaccion: nullable(number()),
	}),
	pricing: object({
		ia: number(),
		sunat: nullable(number()),
		telegram: number(),
	}),
	certificado: nullable(array(filesSchema())),
});

export type InformationSchema = Input<typeof informationSchema> & {
	createdAt?: Date;
	updatedAt?: Date;
};
export type InformationEntitySchema = Omit<
	InformationSchema,
	"id" | "createdAt" | "updatedAt"
> & { address: AddressSchemaEntity; setting: SettingsSchema };
