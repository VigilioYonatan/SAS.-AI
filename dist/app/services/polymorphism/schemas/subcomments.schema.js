"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subcommentsSchema = void 0;
const valibot_1 = require("@vigilio/valibot");
exports.subcommentsSchema = (0, valibot_1.objectAsync)({
    id: (0, valibot_1.number)(),
    content: (0, valibot_1.string)([(0, valibot_1.toTrimmed)(), (0, valibot_1.minLength)(1), (0, valibot_1.minLength)(3), (0, valibot_1.maxLength)(255)]),
    user_id: (0, valibot_1.number)(),
    subcommentsable_id: (0, valibot_1.number)(),
    subcommentsable_type: (0, valibot_1.string)(),
    comment_id: (0, valibot_1.number)(),
    empresa_id: (0, valibot_1.number)(),
});
