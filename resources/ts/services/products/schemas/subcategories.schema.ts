import { slug } from "@vigilio/express-core/helpers";
import {
	minLength,
	type Input,
	number,
	maxLength,
	string,
	transform,
	toTrimmed,
	object,
	array,
} from "@vigilio/valibot";
import type { CategoriesSchemaFromServer } from "./categories.schema";
import { filesSchema } from "~/libs/upload";

export const subcategoriesSchema = object({
	id: number(),
	subcategory_code: string([minLength(1), maxLength(30)]),
	name: string([toTrimmed(), minLength(1), minLength(3), maxLength(200)]),
	image: array(filesSchema()),
	slug: transform(
		string([toTrimmed(), minLength(1), minLength(3), maxLength(200)]),
		slug,
	),
	category_id: number(),
	empresa_id: number(),
});

export type SubcategoriesSchema = Input<typeof subcategoriesSchema>;
export type SubcategoriesSchemaFromServer = SubcategoriesSchema & {
	createdAt: Date;
	updatedAt: Date;
	category: CategoriesSchemaFromServer;
};
