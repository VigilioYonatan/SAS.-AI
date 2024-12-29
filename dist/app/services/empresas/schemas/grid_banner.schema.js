"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gridBannerSchema = void 0;
const valibot_1 = require("@vigilio/valibot");
exports.gridBannerSchema = (0, valibot_1.objectAsync)({
    id: (0, valibot_1.number)(),
    enabled: (0, valibot_1.boolean)(),
    title: (0, valibot_1.nullable)((0, valibot_1.string)()),
    html: (0, valibot_1.nullable)((0, valibot_1.string)()),
    empresa_id: (0, valibot_1.number)(),
});
