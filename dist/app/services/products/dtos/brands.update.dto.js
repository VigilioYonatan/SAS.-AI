"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandsUpdateDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const brands_schema_1 = require("../schemas/brands.schema");
exports.brandsUpdateDto = (0, valibot_1.omitAsync)(brands_schema_1.brandsSchema, [
    "id",
    "brand_code",
    "image",
    "empresa_id",
]);
