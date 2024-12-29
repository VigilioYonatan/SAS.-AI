"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tipoEmpresaSchema = void 0;
const valibot_1 = require("@vigilio/valibot");
exports.tipoEmpresaSchema = (0, valibot_1.objectAsync)({
    id: (0, valibot_1.number)(),
    value: (0, valibot_1.string)(),
    tipo_servicio_id: (0, valibot_1.number)(),
});
