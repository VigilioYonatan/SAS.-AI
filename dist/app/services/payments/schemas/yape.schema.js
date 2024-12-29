"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yapeSchema = void 0;
const valibot_1 = require("@vigilio/valibot");
exports.yapeSchema = (0, valibot_1.object)({
    phoneNumber: (0, valibot_1.string)(),
    otp: (0, valibot_1.string)(),
});
