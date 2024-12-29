"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newSchema = void 0;
const uploads_schema_1 = require("@/uploads/schemas/uploads.schema");
const valibot_1 = require("@vigilio/valibot");
exports.newSchema = (0, valibot_1.objectAsync)({
    id: (0, valibot_1.number)(),
    title: (0, valibot_1.string)([(0, valibot_1.minLength)(1)]),
    subtitle: (0, valibot_1.string)([(0, valibot_1.minLength)(1)]),
    link: (0, valibot_1.nullable)((0, valibot_1.string)([(0, valibot_1.minLength)(1), (0, valibot_1.startsWith)("http")])),
    enabled: (0, valibot_1.boolean)(),
    date: (0, valibot_1.nullable)((0, valibot_1.coerce)((0, valibot_1.date)(), (value) => new Date(value))),
    empresa_id: (0, valibot_1.number)(),
    image: (0, valibot_1.nullable)((0, valibot_1.array)((0, uploads_schema_1.filesSchema)([100, 800]))),
});
