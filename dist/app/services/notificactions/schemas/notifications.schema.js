"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationsSchema = void 0;
const valibot_1 = require("@vigilio/valibot");
exports.notificationsSchema = (0, valibot_1.objectAsync)({
    id: (0, valibot_1.number)(),
    type: (0, valibot_1.string)(),
    url: (0, valibot_1.string)(),
    content: (0, valibot_1.string)(),
    user_id: (0, valibot_1.nullable)((0, valibot_1.number)()),
    empresa_id: (0, valibot_1.number)(),
});
