import { NoImage } from "~/config/settings";
import { type FilesSchema, printFileWithDimension } from "~/libs/upload";
import type { VariantSchemaFromServer } from "../schemas/options/variants.schema";
import { ProductsNormalSchemaFromServer } from "../schemas/products_normal.schema";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
export type ProductImagesQualities = 100 | 500;

export function productEntityId(isService: boolean) {
	const pr = {
		1: "product_normal_id",
		2: "product_restaurant_id",
		3: isService ? "product_servicio_id" : "product_normal_id",
	};
	return pr[storageEmpresa!.tipo_empresa.tipo_servicio_id as keyof typeof pr];
}
export function productEntity(isService: boolean) {
	const pr = {
		1: "product_normal",
		2: "product_restaurant",
		3: isService ? "product_servicio" : "product_normal",
	};
	return pr[storageEmpresa!.tipo_empresa.tipo_servicio_id as keyof typeof pr];
}
export function ProductKeys(isService: boolean) {
	const pr = {
		1: "ProductsNormals",
		2: "ProductsRestaurants",
		3: isService ? "ProductsServicios" : "ProductsNormals",
	};
	return pr[storageEmpresa!.tipo_empresa.tipo_servicio_id as keyof typeof pr];
}
export function productOBJ(id: number) {
	return {
		product_restaurant_id:
			storageEmpresa!.tipo_empresa.tipo_servicio_id === 2 ? id : null,
		product_normal_id: [1, 3].includes(
			storageEmpresa!.tipo_empresa.tipo_servicio_id,
		)
			? id
			: null,
	};
}
export function printImagesProduct(
	images: FilesSchema[] | null,
	quality: ProductImagesQualities | null = 500,
) {
	if (images) {
		return printFileWithDimension(images, quality);
	}
	return [NoImage()];
}

export function printProductVariant(
	product: ProductsNormalSchemaFromServer,
	variant: VariantSchemaFromServer,
) {
	const result = variant.features.map((option) => {
		const opt = product.options.find((opt) => opt.id === option.option_id);
		if (opt) {
			const detailedFeatures = opt.features
				.map((featureId) =>
					variant.features.find((feature) => feature.id === featureId.id)
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
