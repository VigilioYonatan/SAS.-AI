"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsOptionsSchema = void 0;
const valibot_1 = require("@vigilio/valibot");
exports.productsOptionsSchema = (0, valibot_1.objectAsync)({
    product_normal_id: (0, valibot_1.number)(),
    option_id: (0, valibot_1.number)(),
    features: (0, valibot_1.array)((0, valibot_1.number)()),
    empresa_id: (0, valibot_1.number)(),
});
