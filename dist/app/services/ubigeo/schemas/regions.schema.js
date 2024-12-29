"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regionsSchema = void 0;
const valibot_1 = require("@vigilio/valibot");
exports.regionsSchema = (0, valibot_1.object)({
    id: (0, valibot_1.string)(),
    code: (0, valibot_1.string)(),
    name: (0, valibot_1.string)(),
    country_id: (0, valibot_1.number)(),
});
