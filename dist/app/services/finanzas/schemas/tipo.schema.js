"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryFinanzasSchema = exports.tipoFinanzasSchema = void 0;
const valibot_1 = require("@vigilio/valibot");
exports.tipoFinanzasSchema = (0, valibot_1.objectAsync)({
    id: (0, valibot_1.number)(),
    name: (0, valibot_1.string)(),
    empresa_id: (0, valibot_1.number)(),
});
exports.categoryFinanzasSchema = (0, valibot_1.objectAsync)({
    id: (0, valibot_1.number)(),
    value: (0, valibot_1.string)(),
    tipo_finanza_id: (0, valibot_1.number)(),
    icon: (0, valibot_1.string)([(0, valibot_1.startsWith)("<i class=", "Icono no válido")]),
    empresa_id: (0, valibot_1.number)(),
});
