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
	nullable,
	startsWith,
	boolean,
} from "@vigilio/valibot";
import { filesSchema } from "~/libs/upload";
import { array } from "@vigilio/valibot";

export const categoriesSchema = object({
	id: number(),
	category_code: string([minLength(1), maxLength(30)]),
	name: string([toTrimmed(), minLength(1), minLength(3), maxLength(200)]),
	icon: nullable(
		string([
			toTrimmed(),
			minLength(1),
			minLength(3),
			maxLength(200),
			startsWith("<i class=", "Icono no válido"),
		]),
	),
	slug: transform(
		string([toTrimmed(), minLength(1), minLength(3), maxLength(200)]),
		slug,
	),
	image: nullable(array(filesSchema())),
	empresa_id: number(),
	isService: boolean(),
});

export type CategoriesSchema = Input<typeof categoriesSchema>;
export type CategoriesSchemaFromServer = CategoriesSchema & {
	createdAt: Date;
	updatedAt: Date;
};
