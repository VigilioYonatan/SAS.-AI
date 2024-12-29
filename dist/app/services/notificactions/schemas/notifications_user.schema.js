"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationsUserSchema = void 0;
const valibot_1 = require("@vigilio/valibot");
exports.notificationsUserSchema = (0, valibot_1.objectAsync)({
    user_id: (0, valibot_1.number)(),
    notification_id: (0, valibot_1.number)(),
    isRead: (0, valibot_1.boolean)(),
    empresa_id: (0, valibot_1.number)(),
});
