"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionsSchema = void 0;
const valibot_1 = require("@vigilio/valibot");
exports.optionsSchema = (0, valibot_1.objectAsync)({
    id: (0, valibot_1.number)(),
    name: (0, valibot_1.string)([(0, valibot_1.toTrimmed)(), (0, valibot_1.minLength)(1), (0, valibot_1.maxLength)(45)]),
    type: (0, valibot_1.number)(),
});
