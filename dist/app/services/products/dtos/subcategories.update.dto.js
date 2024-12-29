"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subcategoriesUpdateDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const subcategories_schema_1 = require("../schemas/subcategories.schema");
exports.subcategoriesUpdateDto = (0, valibot_1.omitAsync)(subcategories_schema_1.subcategoriesSchema, [
    "id",
    "subcategory_code",
    "image",
    "empresa_id",
]);
