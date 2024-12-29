"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.informationSchema = void 0;
const valibot_1 = require("@vigilio/valibot");
exports.informationSchema = (0, valibot_1.object)({
    id: (0, valibot_1.number)(),
    token: (0, valibot_1.string)(),
});
