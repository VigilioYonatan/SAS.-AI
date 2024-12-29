"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactionsSchema = void 0;
const valibot_1 = require("@vigilio/valibot");
exports.reactionsSchema = (0, valibot_1.objectAsync)({
    id: (0, valibot_1.number)(),
    isLike: (0, valibot_1.boolean)(),
    user_id: (0, valibot_1.number)(),
    reactionsable_id: (0, valibot_1.number)(),
    reactionsable_type: (0, valibot_1.string)(),
    empresa_id: (0, valibot_1.number)(),
});
