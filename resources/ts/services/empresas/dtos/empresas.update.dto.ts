import {
	array,
	type Input,
	instance,
	nullable,
	object,
	omit,
} from "@vigilio/valibot";
import { empresasSchema } from "../schemas/empresas.schema";
import validFileValibot from "~/libs/valibot";

export const empresasUpdateDto = omit(empresasSchema, [
	"id",
	"inteligenceArtificial",
	"contacts",
	"company",
	"whatsappconfig",
	"groupWhatsapp",
	"dial_code",
	"credentials",
	"payments",
	"money",
	"schedule",
	"type_empresa_id",
	"type_empresa_other",
	"port",
	"tipo_impuesto",
	"mercado_pago_comision",
	"isTemplate",
	"certificado",
	"logo",
	"logo_pwa",
	"icon",
	"photo",
	"token",
	"timeWhatsapp",
	"impuestos",
	"tz",
	"twilio",
	"whatsapp_mode",
	"isFreeVPS",
	"versionamiento",
]);
export type EmpresasUpdateDto = Input<typeof empresasUpdateDto>;
export const empresasLogoUpdateDto = object({
	logo: nullable(
		array(instance(File), "Este campo es obligatorio", [
			validFileValibot({
				required: false,
				min: 1,
				max: 1,
			}),
		]),
	),
});
export const empresasLogoPWAUpdateDto = object({
	logo_pwa: nullable(
		array(instance(File), "Este campo es obligatorio", [
			validFileValibot({
				required: false,
				min: 1,
				max: 1,
			}),
		]),
	),
});

export const empresasIconUpdateDto = object({
	icon: nullable(
		array(instance(File), "Este campo es obligatorio", [
			validFileValibot({
				required: false,
				min: 1,
				max: 1,
			}),
		]),
	),
});
export const empresasPhotoUpdateDto = object({
	photo: nullable(
		array(instance(File), "Este campo es obligatorio", [
			validFileValibot({
				required: false,
				min: 1,
				max: 1,
			}),
		]),
	),
});

export type EmpresasLogoUpdateDto = Input<typeof empresasLogoUpdateDto>;
export type EmpresasLogoPWAUpdateDto = Input<typeof empresasLogoPWAUpdateDto>;

export type EmpresasIconUpdateDto = Input<typeof empresasIconUpdateDto>;
export type EmpresasPhotoUpdateDto = Input<typeof empresasPhotoUpdateDto>;
