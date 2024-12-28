import {
    arrayAsync,
    getOutput,
    getPipeIssues,
    mergeAsync,
    nullableAsync,
    number,
    object,
    objectAsync,
    omitAsync,
    string,
    type Input,
} from "@vigilio/valibot";
import { empresasSchema } from "../schemas/empresas.schema";
import { Empresas } from "../entities/empresas.entity";
import { gridBannerSchema } from "../schemas/grid_banner.schema";
import { settingsSchema } from "../schemas/settings.schema";
import { fileSchema } from "../schemas/file.schema";
import { backgroundSchema } from "../schemas/background.schema";
import { categoriesSchema } from "@/products/schemas/categories.schema";
import { productsRestaurantSchema } from "../../products/schemas/products_restaurant.schema";
import { productsServicioSchema } from "@/products/schemas/products_servicio.schema";
import { brandsSchema } from "@/products/schemas/brands.schema";
import { productsNormalStoreDto } from "@/products/dtos/products_normal.dto";
import { subcategoriesSchema } from "@/products/schemas/subcategories.schema";
import { pagesSchema } from "../schemas/pages.schema";
import { gridBannerPageSchema } from "../schemas/grid-banner-page.schema";

export const empresasStoreDto = mergeAsync([
    omitAsync(
        empresasSchema,
        [
            "id",
            "token",
            "certificado",
            "logo",
            "logo_pwa",
            "enabledSound",
            "enabledClientPayComision",
            "enabled_igv",
            "enabledSound",
            "isOpen",
            "enabledAnimation",
            "enabled_catalogo",
            "enable_sell_country",
            "header_cart",
            "whatsapp_mode",
        ],
        [
            async (input) => {
                const [slug] = await Promise.all([
                    Empresas.findOne({
                        where: {
                            slug: input.slug,
                        },
                    }),
                ]);

                if (slug) {
                    return getPipeIssues(
                        "slug",
                        `ya existe ${input.slug}`,
                        input
                    );
                }
                return getOutput(input);
            },
        ]
    ),
    object({
        fullname: string(),
        password: string(),
        servicio_id: number(),
    }),
    objectAsync({
        setting: omitAsync(settingsSchema, ["id", "empresa_id", "host"]),
        gridBanners: nullableAsync(arrayAsync(gridBannerSchema)),
        pages: nullableAsync(
            arrayAsync(
                mergeAsync([
                    pagesSchema,
                    objectAsync({
                        grid_banner_pages: arrayAsync(gridBannerPageSchema),
                    }),
                ])
            )
        ),
        backgrounds: arrayAsync(backgroundSchema),
        files: arrayAsync(fileSchema),
        brands: arrayAsync(brandsSchema),
        categories: arrayAsync(
            mergeAsync([
                objectAsync({
                    subcategories: arrayAsync(subcategoriesSchema),
                    productsNormals: arrayAsync(productsNormalStoreDto),
                    productsRestaurants: arrayAsync(productsRestaurantSchema),
                    productsServicios: arrayAsync(productsServicioSchema),
                }),
                categoriesSchema,
            ])
        ),
    }),
]);

export type EmpresasStoreDto = Input<typeof empresasStoreDto>;
