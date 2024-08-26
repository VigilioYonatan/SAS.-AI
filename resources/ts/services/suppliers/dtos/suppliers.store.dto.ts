import {
	instance,
	merge,
	nullable,
	object,
	omit,
	type Input,
	array,
} from "@vigilio/valibot";
import { suppliersSchema } from "../schemas/suppliers.schema";
import validFileValibot from "~/libs/valibot";

export const suppliersStoreDto = merge([
	omit(suppliersSchema, ["id", "supplier_code", "logo"]),
	object({
		logo: nullable(
			array(instance(File), [
				validFileValibot({
					required: true,
					min: 1,
					max: 1,
					types: [
						"image/webp",
						"image/jpg",
						"image/jpeg",
						"image/png",
						"image/gif",
					],
				}),
			]),
		),
	}),
]);
export type SuppliersStoreDto = Input<typeof suppliersStoreDto>;
