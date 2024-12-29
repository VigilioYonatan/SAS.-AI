"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagesSchema = void 0;
const valibot_1 = require("@vigilio/valibot");
exports.pagesSchema = (0, valibot_1.objectAsync)({
    id: (0, valibot_1.number)(),
    title: (0, valibot_1.string)([(0, valibot_1.minLength)(3), (0, valibot_1.maxLength)(50)]),
    slug: (0, valibot_1.string)([(0, valibot_1.minLength)(3), (0, valibot_1.maxLength)(50)]),
    icon: (0, valibot_1.nullable)((0, valibot_1.string)([
        (0, valibot_1.toTrimmed)(),
        (0, valibot_1.minLength)(1),
        (0, valibot_1.minLength)(3),
        (0, valibot_1.maxLength)(200),
        (0, valibot_1.startsWith)("<i class=", "Icono no válido"),
    ])),
    description: (0, valibot_1.string)(),
    empresa_id: (0, valibot_1.number)(),
});
