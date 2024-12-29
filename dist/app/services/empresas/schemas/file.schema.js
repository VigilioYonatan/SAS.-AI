"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileSchema = void 0;
const uploads_schema_1 = require("@/uploads/schemas/uploads.schema");
const valibot_1 = require("@vigilio/valibot");
exports.fileSchema = (0, valibot_1.objectAsync)({
    id: (0, valibot_1.number)(),
    file: (0, valibot_1.array)((0, uploads_schema_1.filesSchema)([100, 1000])),
    empresa_id: (0, valibot_1.number)(),
});
