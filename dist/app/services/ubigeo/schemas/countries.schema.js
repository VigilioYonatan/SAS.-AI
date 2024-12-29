"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countriesSchema = void 0;
const valibot_1 = require("@vigilio/valibot");
exports.countriesSchema = (0, valibot_1.object)({
    id: (0, valibot_1.number)(),
    code: (0, valibot_1.string)(),
    name: (0, valibot_1.string)(),
});
