"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsSchema = void 0;
const valibot_1 = require("@vigilio/valibot");
exports.commentsSchema = (0, valibot_1.objectAsync)({
    id: (0, valibot_1.number)(),
    content: (0, valibot_1.string)([(0, valibot_1.toTrimmed)(), (0, valibot_1.minLength)(1), (0, valibot_1.minLength)(3), (0, valibot_1.maxLength)(255)]),
    user_id: (0, valibot_1.number)(),
    commentsable_id: (0, valibot_1.number)(),
    commentsable_type: (0, valibot_1.string)(),
    empresa_id: (0, valibot_1.number)(),
});
