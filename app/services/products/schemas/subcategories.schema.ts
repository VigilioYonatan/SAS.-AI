import { filesSchema } from "@/uploads/schemas/uploads.schema";
import { slug } from "@vigilio/express-core/helpers";
import {
	minLength,
	type Input,
	objectAsync,
	number,
	maxLength,
	string,
	transform,
	toTrimmed,
	array,
} from "@vigilio/valibot";
import { categoriesImageQualities } from "../libs";

export const subcategoriesSchema = objectAsync({
	id: number(),
	subcategory_code: string([minLength(1), maxLength(30)]),
	name: string([toTrimmed(), minLength(1), minLength(3), maxLength(200)]),
	image: array(filesSchema(categoriesImageQualities)),
	slug: transform(
		string([toTrimmed(), minLength(1), minLength(3), maxLength(200)]),
		slug,
	),
	category_id: number(),
	empresa_id: number(),
});

export type SubcategoriesSchema = Input<typeof subcategoriesSchema>;
