import {
	type Input,
	omit,
	object,
	nullable,
	array,
	instance,
} from "@vigilio/valibot";
import { informationSchema } from "../schemas/information.schema";
import validFileValibot from "~/libs/valibot";

export const informationUpdateDto = omit(informationSchema, [
	"id",
	"logo",
	"certificado",
	"qrPlin",
	"qrYape",
	"inteligenceArtificial",
	"contacts",
	"company",
	"whatsappconfig",
	"size",
	"groupWhatsapp",
	"isDolar",
	"icon",
	"enable_paypal",
	"token",
	"pasarela",
]);
export type InformationUpdateDto = Input<typeof informationUpdateDto>;
export const informationLogoUpdateDto = object({
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
export const informationImagesHomeUpdateDto = object({
	images_home: array(instance(File), "Este campo es obligatorio", [
		validFileValibot({
			required: false,
			min: 1,
			max: 12,
		}),
	]),
});
export const informationIconUpdateDto = object({
	icon: array(instance(File), "Este campo es obligatorio", [
		validFileValibot({
			required: false,
			min: 1,
			max: 1,
		}),
	]),
});
export const informationQrYapeUpdateDto = object({
	qrYape: nullable(
		array(instance(File), "Este campo es obligatorio", [
			validFileValibot({
				required: false,
				min: 1,
				max: 1,
			}),
		]),
	),
});
export const informationQrPlinUpdateDto = object({
	qrPlin: nullable(
		array(instance(File), "Este campo es obligatorio", [
			validFileValibot({
				required: false,
				min: 1,
				max: 1,
			}),
		]),
	),
});

export type InformationLogoUpdateDto = Input<typeof informationLogoUpdateDto>;
export type InformationImagesHomeUpdateDto = Input<
	typeof informationImagesHomeUpdateDto
>;
export type InformationIconUpdateDto = Input<typeof informationIconUpdateDto>;
export type InformationQrYapeUpdateDto = Input<
	typeof informationQrYapeUpdateDto
>;
export type InformationQrPlinUpdateDto = Input<
	typeof informationQrPlinUpdateDto
>;
