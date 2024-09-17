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
	"empresa_id",
	"qrPlin",
	"qrYape",
]);
export type MetodosPagoUpdateDto = Input<typeof metodosPagoUpdateDto>;
export const empresaQrYapeUpdateDto = object({
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
export const empresaQrPlinUpdateDto = object({
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

export type empresaQrYapeUpdateDto = Input<typeof empresaQrYapeUpdateDto>;
export type empresaQrPlinUpdateDto = Input<typeof empresaQrPlinUpdateDto>;
