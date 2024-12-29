"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gridBannerShopSchema = void 0;
const valibot_1 = require("@vigilio/valibot");
exports.gridBannerShopSchema = (0, valibot_1.objectAsync)({
    id: (0, valibot_1.number)(),
    enabled: (0, valibot_1.boolean)(),
    empresa_id: (0, valibot_1.number)(),
    title: (0, valibot_1.nullable)((0, valibot_1.string)([(0, valibot_1.minLength)(3)])),
    html: (0, valibot_1.nullable)((0, valibot_1.string)([(0, valibot_1.minLength)(3)])),
    grid_banner_id: (0, valibot_1.nullable)((0, valibot_1.number)()),
});
