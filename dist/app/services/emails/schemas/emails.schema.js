"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailsSchema = void 0;
const valibot_1 = require("@vigilio/valibot");
exports.emailsSchema = (0, valibot_1.objectAsync)({
    id: (0, valibot_1.number)(),
    name: (0, valibot_1.string)([(0, valibot_1.toTrimmed)(), (0, valibot_1.minLength)(3), (0, valibot_1.maxLength)(30)]),
    subject: (0, valibot_1.string)([(0, valibot_1.toTrimmed)(), (0, valibot_1.minLength)(4), (0, valibot_1.maxLength)(200)]),
    email: (0, valibot_1.string)([(0, valibot_1.toTrimmed)(), (0, valibot_1.email)()]),
    content: (0, valibot_1.string)([(0, valibot_1.toTrimmed)(), (0, valibot_1.minLength)(10), (0, valibot_1.maxLength)(200)]),
    empresa_id: (0, valibot_1.number)(),
});
