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
import { Options } from "../entities/options/options.entity";
import { Features } from "../entities/options/features.entity";
import { ProductsOptions } from "../entities/options/products_options.entity";
import type { VariantsSchema } from "../schemas/options/variants.schema";
import type { Users } from "@/users/entities/users.entity";
import { Ratings } from "@/polymorphism/entities/ratings.entity";
import { Favorites } from "@/favorites/entities/favorites.entity";
import { removeTextHTML } from "~/libs/helpers";
import { sequelize } from "~/config/db.config";
// products
export const productsImagesQualities = [100, 500];

//  categories
export const categoriesImageQualities = [100, 800];
export const categoriesWallpaperQualities = [100, 1200];
export const brandsImageQualities = [100, 500];

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function Product(empresa: Empresas, isService: boolean): any {
    const pr = {
        1: ProductsNormal,
        2: ProductsRestaurant,
        3: isService ? ProductsServicio : ProductsNormal,
    };

    return pr[empresa.tipo_empresa.tipo_servicio_id as keyof typeof pr];
}
export function ProductKeys(empresa: Empresas, isService: boolean) {
    const pr = {
        1: "ProductsNormals",
        2: "ProductsRestaurants",
        3: isService ? "ProductsServicios" : "ProductsNormals",
    };
    return pr[empresa.tipo_empresa.tipo_servicio_id as keyof typeof pr];
}
export function productEntityId(empresa: Empresas, isService: boolean) {
    const pr = {
        1: "product_normal_id",
        2: "product_restaurant_id",
        3: isService ? "product_servicio_id" : "product_normal_id",
    };
    return pr[empresa.tipo_empresa.tipo_servicio_id as keyof typeof pr];
}
/** combinar para crear variantes */
export function combinacionesVariants(
    arrays: number[][],
    indice = 0,
    combinacion: number[] = []
) {
    if (indice === arrays.length) return [combinacion];

    let resultado: number[][] = [];
    for (const item of arrays[indice]) {
        const combinacionTemp = [...combinacion];
        combinacionTemp.push(item);
        resultado = resultado.concat(
            combinacionesVariants(arrays, indice + 1, combinacionTemp)
        );
    }

    return resultado;
}

/* obtener variantes y opciones para reutilizar */
export async function getProductAll(
    empresa: Empresas,
    product: ProductsNormal | ProductsServicio | ProductsRestaurant,
    user: Users | null,
    isNecesaryAllDescription: boolean,
    isSold = true
) {
    const [ratings] = await Promise.all([
        Ratings.findAll({
            where: {
                ratingsable_id: product.id,
                ratingsable_type: ProductKeys(
                    empresa,
                    product instanceof ProductsServicio
                ),
            },
        }),
    ]);
    if (product instanceof ProductsNormal) {
        const [options, variants] = await Promise.all([
            product.$get("options"),
            product.$get("variants", {
                order: [["id", "ASC"]],
                include: [Features],
            }),
        ]);

        const featureIds = options.flatMap(
            (opt) => opt.ProductsOptions.features
        );

        const features = await Features.findAll({
            where: {
                id: featureIds, // Usamos los IDs de las características
            },
        });

        const featuresMap = new Map(
            features.map((feature) => [feature.id, feature])
        );

        product.dataValues.options = options.map((opt) => {
            const { ProductsOptions, ...rest } = opt.toJSON();
            const mappedFeatures = (
                ProductsOptions as ProductsOptions
            ).features.map((featId) => {
                return featuresMap.get(featId);
            });

            return {
                ...rest,
                features: mappedFeatures,
            };
        });
        const variantIds = variants.map((variant) => variant.id);
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        let variantSales: any = [];
        if (isSold) {
            variantSales = await DetailOrders.findAll({
                where: {
                    product_normal_id: product.id,
                    variant_id: variantIds,
                },
                include: [
                    {
                        model: Orders.unscoped(),
                        where: {
                            status_order_id: STATUSORDER.entregado,
                        },
                        required: true,
                        attributes: [],
                    },
                ],
                attributes: [
                    "variant_id",
                    [
                        sequelize.fn(
                            "COUNT",
                            sequelize.col("DetailOrders.variant_id")
                        ),
                        "totalSold",
                    ],
                ],
                group: ["DetailOrders.variant_id"], // Agrupamos solo por variant_id
            });
        }

        // Crear un mapa de ventas por variante
        const salesMap = new Map(
            isSold
                ? // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                  variantSales.map((sale: any) => [
                      sale.variant_id,
                      sale.get("totalSold"),
                  ])
                : []
        );
        // Asignar las ventas totales a las variantes
        product.dataValues.variants = variants.map((variant) => {
            const totalSold = isSold ? salesMap.get(variant.id) || 0 : 0; // Obtener el total vendido de la variante
            return {
                ...variant.toJSON(),
                totalSold,
            };
        });
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

    if (user) {
        const product_id =
            product instanceof ProductsNormal
                ? "product_normal_id"
                : product instanceof ProductsServicio
                ? "product_servicio_id"
                : "product_restaurant_id";
        const [favorites, rating] = await Promise.all([
            Favorites.findOne({
                where: {
                    [product_id]: product.id,
                    user_id: user.id,
                    empresa_id: empresa.id,
                },
            }),
            Ratings.findOne({
                where: {
                    ratingsable_id: product.id,
                    user_id: user.id,
                    ratingsable_type: [
                        ProductKeys(
                            empresa,
                            product instanceof ProductsServicio
                        ),
                    ],
                    empresa_id: empresa.id,
                },
            }),
        ]);

        product.dataValues.user = {
            isFavorite: !!favorites,
            rating: rating?.rating,
        };
    }
    const starsCount: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalSum = 0;
    for (const rating of ratings) {
        const roundedRating = Math.floor(rating.rating);
        starsCount[roundedRating] = (starsCount[roundedRating] || 0) + 1;
        totalSum += rating.rating;
    }

    const stars5 = ratings.filter((rate) => rate.rating >= 5).length;
    const stars4 = ratings.filter(
        (rate) => rate.rating > 4 && rate.rating < 5
    ).length;
    const stars3 = ratings.filter(
        (rate) => rate.rating > 3 && rate.rating < 4
    ).length;
    const stars2 = ratings.filter(
        (rate) => rate.rating > 2 && rate.rating < 3
    ).length;
    const stars1 = ratings.filter(
        (rate) => rate.rating > 1 && rate.rating < 2
    ).length;

    const rated: {
        quantity: number;
        ratings: { rating: number; percentage: number }[];
        promedio: number;
        stars5: number;
        stars4: number;
        stars3: number;
        stars2: number;
        stars1: number;
    } = {
        quantity: ratings.length,
        promedio: totalSum / ratings.length,
        ratings: Object.keys(starsCount)
            .map((star) => ({
                rating: Number.parseInt(star),
                percentage:
                    ratings.length > 0
                        ? (starsCount[Number.parseInt(star)] / ratings.length) *
                          100
                        : 0,
                length: ratings.filter(
                    (rate) =>
                        rate.rating >= Number.parseInt(star) &&
                        rate.rating < Number.parseInt(star) + 1
                ).length,
            }))
            .toReversed(),
        stars5,
        stars4,
        stars3,
        stars2,
        stars1,
    };
    product.dataValues.rating = rated;
    if (!isNecesaryAllDescription) {
        const desc = removeTextHTML(product.dataValues.description);
        product.dataValues.description = desc ? desc.slice(0, 600) : null;
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
export function areArraysEqual(obj1: any, obj2: any): boolean {
    if (obj1.length !== obj2.length) {
        return false; // Si tienen diferente longitud, no son iguales
    }
    // Convertimos los arrays en sets de strings para compararlos independientemente del orden
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const set1 = new Set(obj1.map((item: any) => JSON.stringify(item)));
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const set2 = new Set(obj2.map((item: any) => JSON.stringify(item)));

    // Verificamos si ambos sets son iguales
    for (const item of set1) {
        if (!set2.has(item)) {
            return false; // Si algún elemento no está en ambos sets, no son iguales
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
        features: { option_id: number; id: number }[];
    }
) {
    const result = variant.features.map((option) => {
        const opt = (product.dataValues.options as Options[]).find(
            (opt) => opt.id === option.option_id
        );
        if (opt) {
            const detailedFeatures = (opt.features as Features[])
                .map((featureId) =>
                    variant.features.find(
                        (feature) => feature.id === featureId.id
                    )
                        ? featureId
                        : null
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
        features: { option_id: number; id: number }[];
    },
    spacing = " "
) {
    return printProductVariant(product, variant)
        .map((variant) => {
            // si es color que muestre el color, sino solo el valor
            return variant?.features.map((feature) => feature?.description);
        })
        .join(spacing);
}
