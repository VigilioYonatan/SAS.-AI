"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsOptionsStoreDto = void 0;
const products_options_schema_1 = require("@/products/schemas/options/products_options.schema");
const valibot_1 = require("@vigilio/valibot");
exports.productsOptionsStoreDto = (0, valibot_1.omitAsync)(products_options_schema_1.productsOptionsSchema, [
    "product_normal_id",
    "empresa_id",
]);
