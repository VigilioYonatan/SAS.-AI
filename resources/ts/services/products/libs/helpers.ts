import { NoImage } from "~/config/settings";
import { type FilesSchema, printFileWithDimension } from "~/libs/upload";
import type { ProductsSchemaFromServer } from "../schemas/products.schema";
import type { VariantSchemaFromServer } from "../schemas/options/variants.schema";
export type ProductImagesQualities = 100 | 500 | 800;

export function printImagesProduct(
	images: FilesSchema[] | null,
	quality: ProductImagesQualities = 800,
) {
	if (images) {
		return printFileWithDimension(images, quality);
	}
	return [NoImage()];
}

export function printProductVariant(
	product: ProductsSchemaFromServer,
	variant: VariantSchemaFromServer,
) {
	const result = variant.features.map((option) => {
		const opt = product.options.find((opt) => opt.id === option.option_id);
		if (opt) {
			const detailedFeatures = opt.features
				.map((featureId) =>
					variant.features.find(
						(feature) => feature.feature_id === featureId.id,
					)
						? featureId
						: null,
				)
				.filter((opt) => opt !== null);
			return { ...opt, features: detailedFeatures };
		}
		return null;
	});
	return result;
}
