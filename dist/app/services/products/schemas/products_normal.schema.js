"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsNormalSchema = void 0;
const valibot_1 = require("@vigilio/valibot");
const uploads_schema_1 = require("@/uploads/schemas/uploads.schema");
const libs_1 = require("../libs");
exports.productsNormalSchema = (0, valibot_1.objectAsync)({
    id: (0, valibot_1.number)(),
    product_code: (0, valibot_1.string)([(0, valibot_1.toTrimmed)(), (0, valibot_1.minLength)(1), (0, valibot_1.maxLength)(30)]),
    name: (0, valibot_1.string)([(0, valibot_1.toTrimmed)(), (0, valibot_1.minLength)(1), (0, valibot_1.minLength)(3), (0, valibot_1.maxLength)(255)]),
    description: (0, valibot_1.nullable)((0, valibot_1.string)([(0, valibot_1.toTrimmed)()])),
    characteristics: (0, valibot_1.array)((0, valibot_1.object)({
        name: (0, valibot_1.string)([(0, valibot_1.toTrimmed)(), (0, valibot_1.minLength)(1)]),
        value: (0, valibot_1.string)([(0, valibot_1.toTrimmed)(), (0, valibot_1.minLength)(1)]),
    })),
    enabled: (0, valibot_1.boolean)(),
    price: (0, valibot_1.number)([(0, valibot_1.minValue)(0)]),
    discount: (0, valibot_1.number)([(0, valibot_1.minValue)(0), (0, valibot_1.maxValue)(100)]),
    slug: (0, valibot_1.string)([(0, valibot_1.minLength)(1), (0, valibot_1.minLength)(3), (0, valibot_1.maxLength)(255)]),
    images: (0, valibot_1.nullable)((0, valibot_1.array)((0, uploads_schema_1.filesSchema)(libs_1.productsImagesQualities))),
    category_id: (0, valibot_1.number)(),
    subcategory_id: (0, valibot_1.nullable)((0, valibot_1.number)()),
    brand_id: (0, valibot_1.nullable)((0, valibot_1.number)()),
    url: (0, valibot_1.nullable)((0, valibot_1.string)()),
    empresa_id: (0, valibot_1.number)(),
});
