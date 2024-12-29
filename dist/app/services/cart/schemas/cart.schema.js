"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartSchema = void 0;
const valibot_1 = require("@vigilio/valibot");
exports.cartSchema = (0, valibot_1.objectAsync)({
    quantity: (0, valibot_1.number)([(0, valibot_1.minValue)(1, "Minimo 1  cantidad")]),
    coupon: (0, valibot_1.nullable)((0, valibot_1.string)()),
    product_normal_id: (0, valibot_1.nullable)((0, valibot_1.number)()),
    product_restaurant_id: (0, valibot_1.nullable)((0, valibot_1.number)()),
    variant_id: (0, valibot_1.nullable)((0, valibot_1.number)()),
    user_id: (0, valibot_1.number)(),
});
