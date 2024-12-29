"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.favoritesSchema = void 0;
const valibot_1 = require("@vigilio/valibot");
exports.favoritesSchema = (0, valibot_1.objectAsync)({
    user_id: (0, valibot_1.number)(),
    product_normal_id: (0, valibot_1.nullable)((0, valibot_1.number)()),
    product_restaurant_id: (0, valibot_1.nullable)((0, valibot_1.number)()),
    product_servicio_id: (0, valibot_1.nullable)((0, valibot_1.number)()),
    empresa_id: (0, valibot_1.number)(),
});
