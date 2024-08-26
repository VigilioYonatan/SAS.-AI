import {
	array,
	instance,
	nullable,
	object,
	omitAsync,
	type Input,
} from "@vigilio/valibot";
import { ruletaSchema } from "../schemas/ruleta.schema";
import validFileValibot from "~/libs/valibot";

export const ruletaUpdateDto = omitAsync(ruletaSchema, ["id", "image"]);
export const ruletaUpdateImageDto = object({
	image: nullable(
		array(instance(File), [
			validFileValibot({
				required: true,
				min: 1,
				max: 1,
			}),
		]),
	),
});
export type RuletaUpdateImageDto = Input<typeof ruletaUpdateImageDto>;

export type RuletaUpdateDto = Input<typeof ruletaUpdateDto>;
