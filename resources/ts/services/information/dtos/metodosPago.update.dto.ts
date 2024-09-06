import {
	array,
	instance,
	nullable,
	object,
	omit,
	type Input,
} from "@vigilio/valibot";
import { metodosPagoSchema } from "../schemas/metodosPago.schema";
import validFileValibot from "~/libs/valibot";

export const metodosPagoUpdateDto = omit(metodosPagoSchema, [
	"information_id",
	"qrPlin",
	"qrYape",
]);
export type MetodosPagoUpdateDto = Input<typeof metodosPagoUpdateDto>;
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

export type InformationQrYapeUpdateDto = Input<
	typeof informationQrYapeUpdateDto
>;
export type InformationQrPlinUpdateDto = Input<
	typeof informationQrPlinUpdateDto
>;
