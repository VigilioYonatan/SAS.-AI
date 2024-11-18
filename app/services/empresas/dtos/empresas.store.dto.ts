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
import { bannerSchema } from "../schemas/banner.schema";
import { gridBannerSchema } from "../schemas/grid_banner.schema";
import { settingsSchema } from "../schemas/settings.schema";

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
        setting: omitAsync(settingsSchema, ["id", "empresa_id"]),
        gridBanners: nullableAsync(
            arrayAsync(
                mergeAsync([
                    gridBannerSchema,
                    objectAsync({ banners: arrayAsync(bannerSchema) }),
                ])
            )
        ),
    }),
]);

export type EmpresasStoreDto = Input<typeof empresasStoreDto>;
