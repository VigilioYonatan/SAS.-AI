"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redesChatSchema = void 0;
const valibot_1 = require("@vigilio/valibot");
exports.redesChatSchema = (0, valibot_1.objectAsync)({
    id: (0, valibot_1.number)(),
    whatsapp_chat: (0, valibot_1.array)((0, valibot_1.object)({ id: (0, valibot_1.string)(), name: (0, valibot_1.string)() })),
    tiktok_chat: (0, valibot_1.array)((0, valibot_1.object)({ id: (0, valibot_1.string)(), name: (0, valibot_1.string)() })),
    linkedin_chat: (0, valibot_1.array)((0, valibot_1.object)({ id: (0, valibot_1.string)(), name: (0, valibot_1.string)() })),
    messenger_chat: (0, valibot_1.array)((0, valibot_1.object)({ id: (0, valibot_1.string)(), name: (0, valibot_1.string)() })),
    instagram_chat: (0, valibot_1.array)((0, valibot_1.object)({ id: (0, valibot_1.string)(), name: (0, valibot_1.string)() })),
    telegram_chat: (0, valibot_1.array)((0, valibot_1.object)({ id: (0, valibot_1.string)(), name: (0, valibot_1.string)() })),
    empresa_id: (0, valibot_1.number)(),
});
