"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kindDebitNotesSchema = void 0;
const valibot_1 = require("@vigilio/valibot");
exports.kindDebitNotesSchema = (0, valibot_1.objectAsync)({
    code: (0, valibot_1.string)(),
    name: (0, valibot_1.string)(),
});
