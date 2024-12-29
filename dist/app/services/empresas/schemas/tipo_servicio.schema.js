"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tipoServicioSchema = void 0;
const valibot_1 = require("@vigilio/valibot");
exports.tipoServicioSchema = (0, valibot_1.objectAsync)({
    id: (0, valibot_1.number)(),
    tipo: (0, valibot_1.string)(),
});
