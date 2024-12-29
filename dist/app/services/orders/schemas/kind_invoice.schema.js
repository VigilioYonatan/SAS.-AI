"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kindInvoiceSchema = void 0;
const valibot_1 = require("@vigilio/valibot");
exports.kindInvoiceSchema = (0, valibot_1.objectAsync)({
    code: (0, valibot_1.string)(),
    name: (0, valibot_1.string)(),
});
