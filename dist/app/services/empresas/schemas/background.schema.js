"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.backgroundSchema = void 0;
const uploads_schema_1 = require("@/uploads/schemas/uploads.schema");
const valibot_1 = require("@vigilio/valibot");
const libs_1 = require("../libs");
exports.backgroundSchema = (0, valibot_1.objectAsync)({
    id: (0, valibot_1.number)(),
    image: (0, valibot_1.array)((0, uploads_schema_1.filesSchema)(libs_1.backgroundQualities)),
    html: (0, valibot_1.nullable)((0, valibot_1.string)()),
    empresa_id: (0, valibot_1.number)(),
});
