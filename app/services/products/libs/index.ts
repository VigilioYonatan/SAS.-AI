import { printFileWithDimension } from "@/uploads/libs/helpers";
import type { FilesSchema } from "@/uploads/schemas/uploads.schema";
import { DetailOrders } from "@/orders/entities/detail_orders.entity";
import { Orders } from "@/orders/entities/orders.entity";
import { STATUSORDER } from "@/orders/libs";
import type { Empresas } from "@/empresas/entities/empresas.entity";
import { ProductsNormal } from "../entities/products_normal.entity";
import { ProductsRestaurant } from "../entities/products_restaurant.entity";
import { ProductsServicio } from "../entities/products_servicio.entity";
import type { ProductsNormalSchema } from "../schemas/products_normal.schema";
import type { ProductsRestaurantSchema } from "../schemas/products_restaurant.schema";
import type { ProductsServicioSchema } from "../schemas/products_servicio.schema";
import { BASE_URL } from "@/empresas/libs";
import { Variants } from "../entities/options/variants.entity";
import { Options } from "../entities/options/options.entity";
import { Features } from "../entities/options/features.entity";
import { ProductsOptions } from "../entities/options/products_options.entity";
import type { VariantsSchema } from "../schemas/options/variants.schema";
// products
export const productsImagesQualities = [100, 500];

//  categories
export const categoriesImageQualities = [100, 500];
export const brandsImageQualities = [100, 500];

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function Product(empresa: Empresas): any {
	const pr = {
		1: ProductsNormal,
		2: ProductsRestaurant,
		3: ProductsServicio,
	};
	return pr[empresa.tipo_empresa.tipo_servicio_id as keyof typeof pr];
}
export function ProductKeys(empresa: Empresas) {
	const pr = {
		1: "ProductsNormals",
		2: "ProductsRestaurants",
		3: "ProductsServicios",
	};
	return pr[empresa.tipo_empresa.tipo_servicio_id as keyof typeof pr];
}
export function productEntityId(empresa: Empresas) {
	const pr = {
		1: "product_normal_id",
		2: "product_restaurant_id",
		3: "product_servicio_id",
	};
	return pr[empresa.tipo_empresa.tipo_servicio_id as keyof typeof pr];
}

/** combinar para crear variantes */
export function combinacionesVariants(
	arrays: number[][],
	indice = 0,
	combinacion: number[] = [],
) {
	if (indice === arrays.length) return [combinacion];

	let resultado: number[][] = [];
	for (const item of arrays[indice]) {
		const combinacionTemp = [...combinacion];
		combinacionTemp.push(item);
		resultado = resultado.concat(
			combinacionesVariants(arrays, indice + 1, combinacionTemp),
		);
	}

	return resultado;
}

/* obtener variantes y opciones para reutilizar */
export async function getProductAll(
	empresa: Empresas,
	product: ProductsNormal | ProductsServicio | ProductsRestaurant,
) {
	if (empresa.tipo_empresa.tipo_servicio_id === 1) {
		const [options, variants] = await Promise.all([
			(product as ProductsNormal).$get("options") as Promise<
				(Options & {
					ProductsOptions: ProductsOptions;
				})[]
			>,
			(product as ProductsNormal).$get("variants", {
				order: [["id", "ASC"]],
			}),
		]);

		product.dataValues.options = await Promise.all(
			options.map(async (opt) => {
				const { ProductsOptions, ...rest } = opt.toJSON();
				const features = await Promise.all(
					opt.ProductsOptions.features.map(async (feat) => {
						const feature = await Features.findByPk(feat);
						return feature;
					}),
				);
				return {
					...rest,
					features,
				};
			}),
		);

		product.dataValues.variants = await Promise.all(
			variants.map(async (variant) => {
				const features = await (variant as Variants).$get("features");
				const totalSold = await DetailOrders.count({
					where: {
						product_normal_id: product.id,
						variant_id: (variant as Variants).id,
					},
					include: [
						{
							model: Orders,
							where: {
								status_order_id: STATUSORDER.entregado,
							},
							required: true,
						},
					],
				});
				return {
					...(variant as Variants).toJSON(),
					features: (features as Features[]).map((feat) => ({
						option_id: feat.option_id,
						feature_id: feat.id,
					})),
					totalSold,
				};
			}),
		);
	} else {
		const product_id =
			product instanceof ProductsNormal
				? "product_normal_id"
				: product instanceof ProductsServicio
					? "product_servicio_id"
					: "product_restaurant_id";
		const [totalSold] = await Promise.all([
			DetailOrders.count({
				where: {
					[product_id]: product.id,
					empresa_id: empresa.id,
				},
				include: [
					{
						model: Orders,
						where: {
							status_order_id: STATUSORDER.entregado,
						},
						required: true,
					},
				],
			}),
		]);
		product.dataValues.totalSold = totalSold;
	}

	return product;
}
export function printImagesProduct(empresa: Empresas) {
	return (images: FilesSchema[] | null, quality = 500) => {
		if (images) {
			return printFileWithDimension(empresa)(images, quality);
		}
		return [`${BASE_URL(empresa)}/images/settings/others/no-profile.webp`];
	};
}
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function deepEqual(obj1: any, obj2: any): boolean {
	// Comparación de igualdad directa
	if (obj1 === obj2) {
		return true;
	}
	// Verificación de null y tipo de objeto
	if (
		obj1 == null ||
		obj2 == null ||
		typeof obj1 !== "object" ||
		typeof obj2 !== "object"
	) {
		return false;
	}
	// Obtención de las claves de los objetos
	const keys1 = Object.keys(obj1);
	const keys2 = Object.keys(obj2);
	// Comparación de la longitud de las claves
	if (keys1.length !== keys2.length) {
		return false;
	}
	// Comparación de los valores de las claves
	for (const key of keys1) {
		if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
			return false;
		}
	}

	return true;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function areArraysEqual(array1: any[], array2: any[]): boolean {
	// Comparación de la longitud de los arrays
	if (array1.length !== array2.length) {
		return false;
	}
	// Comparación de los elementos del array
	for (let i = 0; i < array1.length; i++) {
		if (!deepEqual(array1[i], array2[i])) {
			return false;
		}
	}

	return true;
}
type ArrayNoRepeat = {
	array1: number[];
	array2: number[];
	onDelete?: (props: number[]) => Promise<void>;
	onCreate?: (props: number[]) => Promise<void>;
};
export async function arrayNoRepeat({
	array1,
	array2,
	onDelete,
	onCreate,
}: ArrayNoRepeat) {
	const array1Set = new Set(array1);
	const array2Set = new Set(array2);
	if (
		array1Set.size === array2Set.size &&
		[...array1Set].every((id) => array2Set.has(id))
	) {
	} else if (array1Set.size > array2Set.size) {
		const deleteIds = [...array1Set].filter((id) => !array2Set.has(id));
		if (onDelete) {
			await onDelete(deleteIds);
		}
	} else {
		const addedIds = [...array2Set].filter((id) => !array1Set.has(id));
		if (onCreate) {
			await onCreate(addedIds);
		}
	}
}
export function printProductVariant(
	product: ProductsNormal,
	variant: VariantsSchema & {
		features: { option_id: number; feature_id: number }[];
	},
) {
	const result = variant.features.map((option) => {
		const opt = (product.dataValues.options as Options[]).find(
			(opt) => opt.id === option.option_id,
		);
		if (opt) {
			const detailedFeatures = (opt.features as Features[])
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

export type Products = {
	product_normal: ProductsNormalSchema | null;
	product_restaurant: ProductsRestaurantSchema | null;
	product_servicio: ProductsServicioSchema | null;
};
export function printVariantFeatures(
	product: ProductsNormal,
	variant: VariantsSchema & {
		features: { option_id: number; feature_id: number }[];
	},
	spacing = " ",
) {
	return printProductVariant(product, variant)
		.map((variant) => {
			// si es color que muestre el color, sino solo el valor
			return variant?.features.map((feature) => feature?.description);
		})
		.join(spacing);
}
