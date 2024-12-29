"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payMethodsSchema = void 0;
const valibot_1 = require("@vigilio/valibot");
exports.payMethodsSchema = (0, valibot_1.objectAsync)({
    id: (0, valibot_1.number)(),
    name: (0, valibot_1.string)(),
});
