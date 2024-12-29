"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationsPushDto = void 0;
const valibot_1 = require("@vigilio/valibot");
exports.notificationsPushDto = (0, valibot_1.objectAsync)({
    title: (0, valibot_1.string)(),
    message: (0, valibot_1.string)(),
    subscription: (0, valibot_1.unknown)(),
});
