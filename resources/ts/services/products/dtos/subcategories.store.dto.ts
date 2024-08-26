import {
	type Input,
	omit,
	merge,
	array,
	instance,
	object,
} from "@vigilio/valibot";
import { subcategoriesSchema } from "../schemas/subcategories.schema";
import validFileValibot from "~/libs/valibot";

export const subcategoriesStoreDto = merge([
	omit(subcategoriesSchema, ["id", "subcategory_code", "image"]),
	object({
		image: array(instance(File), [
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
	}),
]);
export type SubcategoriesStoreDto = Input<typeof subcategoriesStoreDto>;
