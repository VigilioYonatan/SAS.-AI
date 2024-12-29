"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.floorsSchema = void 0;
const valibot_1 = require("valibot");
exports.floorsSchema = (0, valibot_1.objectAsync)({
    id: (0, valibot_1.number)(),
    name: (0, valibot_1.string)([(0, valibot_1.minLength)(1), (0, valibot_1.maxLength)(100)]),
    empresa_id: (0, valibot_1.number)(),
});
