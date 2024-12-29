"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesUpdateDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const categories_schema_1 = require("../schemas/categories.schema");
exports.categoriesUpdateDto = (0, valibot_1.omitAsync)(categories_schema_1.categoriesSchema, [
    "id",
    "category_code",
    "empresa_id",
    "image",
    "wallpaper",
]);
