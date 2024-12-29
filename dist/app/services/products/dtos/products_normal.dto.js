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
exports.productsNormalUpdateDto = exports.productsNormalStoreDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const products_normal_schema_1 = require("../schemas/products_normal.schema");
const products_options_schema_1 = require("../schemas/options/products_options.schema");
const products_normal_entity_1 = require("../entities/products_normal.entity");
exports.productsNormalStoreDto = (0, valibot_1.mergeAsync)([
    (0, valibot_1.omitAsync)(products_normal_schema_1.productsNormalSchema, ["id", "product_code"]),
    (0, valibot_1.objectAsync)({
        options: (0, valibot_1.arrayAsync)((0, valibot_1.omitAsync)(products_options_schema_1.productsOptionsSchema, [
            "product_normal_id",
            "empresa_id",
        ]), [(0, valibot_1.minLength)(1)]),
    }),
], [
    (input) => __awaiter(void 0, void 0, void 0, function* () {
        const [byName, bySlug] = yield Promise.all([
            products_normal_entity_1.ProductsNormal.findOne({
                where: {
                    name: input.name,
                    empresa_id: input.empresa_id,
                },
                raw: true,
            }),
            products_normal_entity_1.ProductsNormal.findOne({
                where: {
                    slug: input.slug,
                    empresa_id: input.empresa_id,
                },
                raw: true,
            }),
        ]);
        if (byName) {
            return (0, valibot_1.getPipeIssues)("name", `Ya existe el producto con el nombre: ${input.name}`, input);
        }
        if (bySlug) {
            return (0, valibot_1.getPipeIssues)("slug", `Ya existe el producto con el slug: ${input.slug}`, input);
        }
        return (0, valibot_1.getOutput)(input);
    }),
]);
exports.productsNormalUpdateDto = (0, valibot_1.mergeAsync)([
    (0, valibot_1.omitAsync)(products_normal_schema_1.productsNormalSchema, [
        "id",
        "product_code",
        "images",
        "empresa_id",
    ]),
    (0, valibot_1.objectAsync)({
        options: (0, valibot_1.arrayAsync)((0, valibot_1.omitAsync)(products_options_schema_1.productsOptionsSchema, [
            "product_normal_id",
            "empresa_id",
        ])),
    }),
]);
