"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartUpdateDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const cart_schema_1 = require("../schemas/cart.schema");
exports.cartUpdateDto = (0, valibot_1.omitAsync)(cart_schema_1.cartSchema, [
    "user_id",
    "product_normal_id",
    "product_restaurant_id",
]);
