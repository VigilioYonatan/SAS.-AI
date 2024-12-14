import {
    type Input,
    omitAsync,
    getOutput,
    getPipeIssues,
    mergeAsync,
    objectAsync,
    arrayAsync,
    minLength,
} from "@vigilio/valibot";
import {
    productsNormalSchema,
    type ProductsNormalSchema,
} from "../schemas/products_normal.schema";
import { productsOptionsSchema } from "../schemas/options/products_options.schema";
import { ProductsNormal } from "../entities/products_normal.entity";

export const productsNormalStoreDto = mergeAsync(
    [
        omitAsync(productsNormalSchema, ["id", "product_code"]),
        objectAsync({
            options: arrayAsync(
                omitAsync(productsOptionsSchema, [
                    "product_normal_id",
                    "empresa_id",
                ]),
                [minLength(1)]
            ),
        }),
    ],
    [
        async (input) => {
            const [byName, bySlug] = await Promise.all([
                ProductsNormal.findOne({
                    where: {
                        name: input.name,
                        empresa_id: input.empresa_id,
                    },
                    raw: true,
                }),
                ProductsNormal.findOne({
                    where: {
                        slug: input.slug,
                        empresa_id: input.empresa_id,
                    },
                    raw: true,
                }),
                // Categories.findByPk(input.category_id),
            ]);

            if (byName) {
                return getPipeIssues(
                    "name" as keyof ProductsNormalSchema,
                    `Ya existe el producto con el nombre: ${input.name}`,
                    input
                );
            }
            if (bySlug) {
                return getPipeIssues(
                    "slug" as keyof ProductsNormalSchema,
                    `Ya existe el producto con el slug: ${input.slug}`,
                    input
                );
            }

            // if (!byCategoryId) {
            // 	return getPipeIssues(
            // 		"category_id" as keyof ProductsNormalSchema,
            // 		`No existe la categoría ${input.category_id}`,
            // 		input,
            // 	);
            // }
            return getOutput(input);
        },
    ]
);

export const productsNormalUpdateDto = mergeAsync([
    omitAsync(productsNormalSchema, [
        "id",
        "product_code",
        "images",
        "empresa_id",
    ]),
    objectAsync({
        options: arrayAsync(
            omitAsync(productsOptionsSchema, [
                "product_normal_id",
                "empresa_id",
            ])
        ),
    }),
]);
export type ProductsNormalStoreDto = Input<typeof productsNormalStoreDto>;

export type ProductsNormalUpdateDto = Input<typeof productsNormalUpdateDto>;
