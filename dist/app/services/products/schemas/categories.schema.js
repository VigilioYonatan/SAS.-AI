"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesSchema = void 0;
const uploads_schema_1 = require("@/uploads/schemas/uploads.schema");
const helpers_1 = require("@vigilio/express-core/helpers");
const valibot_1 = require("@vigilio/valibot");
const libs_1 = require("../libs");
exports.categoriesSchema = (0, valibot_1.objectAsync)({
    id: (0, valibot_1.number)(),
    category_code: (0, valibot_1.string)([(0, valibot_1.minLength)(1), (0, valibot_1.maxLength)(30)]),
    name: (0, valibot_1.string)([(0, valibot_1.toTrimmed)(), (0, valibot_1.minLength)(1), (0, valibot_1.minLength)(3), (0, valibot_1.maxLength)(200)]),
    isService: (0, valibot_1.boolean)(),
    icon: (0, valibot_1.nullable)((0, valibot_1.string)([
        (0, valibot_1.toTrimmed)(),
        (0, valibot_1.minLength)(1),
        (0, valibot_1.minLength)(3),
        (0, valibot_1.maxLength)(200),
        (0, valibot_1.startsWith)("<i class=", "Icono no válido"),
    ])),
    slug: (0, valibot_1.transform)((0, valibot_1.string)([(0, valibot_1.toTrimmed)(), (0, valibot_1.minLength)(1), (0, valibot_1.minLength)(3), (0, valibot_1.maxLength)(200)]), helpers_1.slug),
    image: (0, valibot_1.nullable)((0, valibot_1.array)((0, uploads_schema_1.filesSchema)(libs_1.categoriesImageQualities))),
    wallpaper: (0, valibot_1.nullable)((0, valibot_1.array)((0, uploads_schema_1.filesSchema)(libs_1.categoriesWallpaperQualities))),
    empresa_id: (0, valibot_1.number)(),
});
