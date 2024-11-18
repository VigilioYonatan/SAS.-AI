import {
	type Input,
	getOutput,
	omitAsync,
	getPipeIssues,
} from "@vigilio/valibot";
import { Subcategories } from "../entities/subcategories.entity";
import { subcategoriesSchema } from "../schemas/subcategories.schema";

export const subcategoriesStoreDto = omitAsync(
	subcategoriesSchema,
	["id", "subcategory_code"],
	[
		async (input) => {
			const [byName, bySlug] = await Promise.all([
				Subcategories.findOne({
					where: {
						name: input.name,
						empresa_id: input.empresa_id,
					},
					raw: true,
				}),
				Subcategories.findOne({
					where: {
						slug: input.slug,
						empresa_id: input.empresa_id,
					},
					raw: true,
				}),
			]);

			if (byName) {
				return getPipeIssues(
					"name",
					`Ya existe la subcategoría con el nombre: ${input.name}`,
					input,
				);
			}
			if (bySlug) {
				return getPipeIssues(
					"slug",
					`Ya existe la subcategoría con el slug: ${input.slug}`,
					input,
				);
			}
			return getOutput(input);
		},
	],
);
export type SubcategoriesStoreDto = Input<typeof subcategoriesStoreDto>;
