"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.empresasStoreDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const empresas_schema_1 = require("../schemas/empresas.schema");
const empresas_entity_1 = require("../entities/empresas.entity");
const grid_banner_schema_1 = require("../schemas/grid_banner.schema");
const settings_schema_1 = require("../schemas/settings.schema");
const file_schema_1 = require("../schemas/file.schema");
const background_schema_1 = require("../schemas/background.schema");
const categories_schema_1 = require("@/products/schemas/categories.schema");
const products_restaurant_schema_1 = require("../../products/schemas/products_restaurant.schema");
const products_servicio_schema_1 = require("@/products/schemas/products_servicio.schema");
const brands_schema_1 = require("@/products/schemas/brands.schema");
const products_normal_dto_1 = require("@/products/dtos/products_normal.dto");
const subcategories_schema_1 = require("@/products/schemas/subcategories.schema");
const pages_schema_1 = require("../schemas/pages.schema");
const grid_banner_page_schema_1 = require("../schemas/grid-banner-page.schema");
exports.empresasStoreDto = (0, valibot_1.mergeAsync)([
    (0, valibot_1.omitAsync)(empresas_schema_1.empresasSchema, [
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
    ], [
        (input) => __awaiter(void 0, void 0, void 0, function* () {
            const [slug] = yield Promise.all([
                empresas_entity_1.Empresas.findOne({
                    where: {
                        slug: input.slug,
                    },
                }),
            ]);
            if (slug) {
                return (0, valibot_1.getPipeIssues)("slug", `ya existe ${input.slug}`, input);
            }
            return (0, valibot_1.getOutput)(input);
        }),
    ]),
    (0, valibot_1.object)({
        fullname: (0, valibot_1.string)(),
        password: (0, valibot_1.string)(),
        servicio_id: (0, valibot_1.number)(),
    }),
    (0, valibot_1.objectAsync)({
        setting: (0, valibot_1.omitAsync)(settings_schema_1.settingsSchema, ["id", "empresa_id", "host"]),
        gridBanners: (0, valibot_1.nullableAsync)((0, valibot_1.arrayAsync)(grid_banner_schema_1.gridBannerSchema)),
        pages: (0, valibot_1.nullableAsync)((0, valibot_1.arrayAsync)((0, valibot_1.mergeAsync)([
            pages_schema_1.pagesSchema,
            (0, valibot_1.objectAsync)({
                grid_banner_pages: (0, valibot_1.arrayAsync)(grid_banner_page_schema_1.gridBannerPageSchema),
            }),
        ]))),
        backgrounds: (0, valibot_1.arrayAsync)(background_schema_1.backgroundSchema),
        files: (0, valibot_1.arrayAsync)(file_schema_1.fileSchema),
        brands: (0, valibot_1.arrayAsync)(brands_schema_1.brandsSchema),
        categories: (0, valibot_1.arrayAsync)((0, valibot_1.mergeAsync)([
            (0, valibot_1.objectAsync)({
                subcategories: (0, valibot_1.arrayAsync)(subcategories_schema_1.subcategoriesSchema),
                productsNormals: (0, valibot_1.arrayAsync)(products_normal_dto_1.productsNormalStoreDto),
                productsRestaurants: (0, valibot_1.arrayAsync)(products_restaurant_schema_1.productsRestaurantSchema),
                productsServicios: (0, valibot_1.arrayAsync)(products_servicio_schema_1.productsServicioSchema),
            }),
            categories_schema_1.categoriesSchema,
        ])),
        isWhatsappFree: (0, valibot_1.boolean)(),
    }),
]);
