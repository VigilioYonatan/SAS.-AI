"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.variantsSchema = void 0;
const valibot_1 = require("@vigilio/valibot");
exports.variantsSchema = (0, valibot_1.objectAsync)({
    id: (0, valibot_1.number)(),
    sku: (0, valibot_1.nullable)((0, valibot_1.string)([(0, valibot_1.toTrimmed)(), (0, valibot_1.minLength)(3), (0, valibot_1.maxLength)(45)])),
    stock: (0, valibot_1.nullable)((0, valibot_1.number)([(0, valibot_1.minValue)(0, "Minimo 0 cantidades.")])),
    ilimit: (0, valibot_1.boolean)(),
    images: (0, valibot_1.array)((0, valibot_1.number)()),
    product_normal_id: (0, valibot_1.nullable)((0, valibot_1.number)()),
    empresa_id: (0, valibot_1.number)(),
});
