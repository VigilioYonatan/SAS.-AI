import {
	type Input,
	omit,
	merge,
	array,
	instance,
	object,
} from "@vigilio/valibot";
import { familiesSchema } from "../schemas/families.schema";
import validFileValibot from "~/libs/valibot";

export const familiesStoreDto = merge([
	omit(familiesSchema, ["id", "family_code", "image", "background"]),
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
		background: array(instance(File), [
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
export type FamiliesStoreDto = Input<typeof familiesStoreDto>;
