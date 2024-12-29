"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questionsSchema = void 0;
const valibot_1 = require("@vigilio/valibot");
exports.questionsSchema = (0, valibot_1.objectAsync)({
    id: (0, valibot_1.number)(),
    question: (0, valibot_1.string)([(0, valibot_1.minLength)(5), (0, valibot_1.maxLength)(250)]),
    answer: (0, valibot_1.nullable)((0, valibot_1.string)([(0, valibot_1.maxLength)(250)])),
    empresa_id: (0, valibot_1.number)(),
});
