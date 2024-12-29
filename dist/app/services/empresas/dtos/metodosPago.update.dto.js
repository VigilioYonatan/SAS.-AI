"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metodosPagoUpdateDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const metodosPago_schema_1 = require("../schemas/metodosPago.schema");
exports.metodosPagoUpdateDto = (0, valibot_1.omitAsync)(metodosPago_schema_1.metodosPagoSchema, [
    "empresa_id",
    "qrPlin",
    "qrYape",
]);
