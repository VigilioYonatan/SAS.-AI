"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detailOrdersSchema = void 0;
const valibot_1 = require("@vigilio/valibot");
exports.detailOrdersSchema = (0, valibot_1.objectAsync)({
    id: (0, valibot_1.number)(),
    quantity: (0, valibot_1.number)(),
    variante: (0, valibot_1.nullable)((0, valibot_1.string)()),
    price: (0, valibot_1.number)(),
    order_id: (0, valibot_1.number)(),
    product_normal_id: (0, valibot_1.nullable)((0, valibot_1.number)()),
    product_restaurant_id: (0, valibot_1.nullable)((0, valibot_1.number)()),
    product_servicio_id: (0, valibot_1.nullable)((0, valibot_1.number)()),
    variant_id: (0, valibot_1.nullable)((0, valibot_1.number)()),
    coupon: (0, valibot_1.nullable)((0, valibot_1.string)()),
    empresa_id: (0, valibot_1.number)(),
});
