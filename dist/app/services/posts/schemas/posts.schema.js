"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsSchema = void 0;
const uploads_schema_1 = require("@/uploads/schemas/uploads.schema");
const valibot_1 = require("@vigilio/valibot");
const libs_1 = require("../libs");
exports.postsSchema = (0, valibot_1.objectAsync)({
    id: (0, valibot_1.number)(),
    content: (0, valibot_1.string)([(0, valibot_1.toTrimmed)(), (0, valibot_1.minLength)(10), (0, valibot_1.maxLength)(255)]),
    title: (0, valibot_1.string)([(0, valibot_1.toTrimmed)(), (0, valibot_1.minLength)(5), (0, valibot_1.maxLength)(255)]),
    likes: (0, valibot_1.array)((0, valibot_1.string)()),
    image: (0, valibot_1.array)((0, uploads_schema_1.filesSchema)(libs_1.postsImageQualities)),
    user_id: (0, valibot_1.number)(),
    empresa_id: (0, valibot_1.number)(),
});
