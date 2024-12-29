"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regionsEmpresaSchema = void 0;
const valibot_1 = require("@vigilio/valibot");
exports.regionsEmpresaSchema = (0, valibot_1.object)({
    region_id: (0, valibot_1.number)(),
    empresa_id: (0, valibot_1.number)(),
    priceShipping: (0, valibot_1.number)(),
    enabled: (0, valibot_1.boolean)(),
    days: (0, valibot_1.number)(),
});
