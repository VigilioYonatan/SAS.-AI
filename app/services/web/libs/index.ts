import { Features } from "@/products/entities/options/features.entity";
import { Options } from "@/products/entities/options/options.entity";
import { ProductsOptions } from "@/products/entities/options/products_options.entity";
import { ProductsNormal } from "@/products/entities/products_normal.entity";
import { Op } from "sequelize";

export async function getFeatures(
	products: ProductsNormal[],
	category_id?: number,
	brand_id?: number,
) {
	const options = await Promise.all(
		products.map(async (product) => {
			const opt = await ProductsOptions.findAll({
				where: {
					product_normal_id: product.id,
				},
			});
			return opt;
		}),
	);
	// Step 1: Flatten the array of arrays into a single array
	const flattened = options.flat();

	// Step 2: Group by option_id and merge features
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const grouped = flattened.reduce((acc: any, item) => {
		if (!acc[item.option_id]) {
			acc[item.option_id] = {
				option_id: item.option_id,
				features: new Set(item.features),
			};
		} else {
			for (const feature of item.features) {
				acc[item.option_id].features.add(feature);
			}
		}
		return acc;
	}, {}) as [{ option_id: number; features: number[] }];

	const where = brand_id
		? { brand_id: brand_id }
		: { category_id: category_id };
	// Step 3: Convert the grouped object to an array with the desired format
	const optionsFeatures = await Promise.all(
		Object.values(grouped).map(async (item) => {
			const option = await Options.findByPk(item.option_id);

			const features = await Promise.all(
				[...item.features].map(async (feature) => {
					const featur = await Features.findByPk(feature);
					const quantity = await ProductsOptions.count({
						where: {
							option_id: item.option_id,
							features: {
								[Op.contains]: [feature],
							},
						},
						include: [
							{
								model: ProductsNormal,
								where,
								required: true, // Asegura que solo se devuelvan resultados con Product asociado
							},
						],
					});
					return { ...featur?.toJSON(), quantity };
				}),
			);
			return {
				...option?.toJSON(),
				features,
			};
		}),
	);
	return optionsFeatures;
}
