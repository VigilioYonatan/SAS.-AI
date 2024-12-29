"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.variantsUpdateDto = void 0;
const variants_schema_1 = require("@/products/schemas/options/variants.schema");
const valibot_1 = require("@vigilio/valibot");
exports.variantsUpdateDto = (0, valibot_1.omitAsync)(variants_schema_1.variantsSchema, [
    "id",
    "product_normal_id",
    "empresa_id",
]);
