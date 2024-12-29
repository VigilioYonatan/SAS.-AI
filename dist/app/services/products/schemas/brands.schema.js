"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandsSchema = void 0;
const uploads_schema_1 = require("@/uploads/schemas/uploads.schema");
const valibot_1 = require("@vigilio/valibot");
const libs_1 = require("../libs");
exports.brandsSchema = (0, valibot_1.objectAsync)({
    id: (0, valibot_1.number)(),
    name: (0, valibot_1.string)([(0, valibot_1.minLength)(2), (0, valibot_1.maxLength)(100)]),
    brand_code: (0, valibot_1.string)(),
    slug: (0, valibot_1.string)([(0, valibot_1.minLength)(2), (0, valibot_1.maxLength)(100)]),
    image: (0, valibot_1.nullable)((0, valibot_1.array)((0, uploads_schema_1.filesSchema)(libs_1.brandsImageQualities))),
    empresa_id: (0, valibot_1.number)(),
});
