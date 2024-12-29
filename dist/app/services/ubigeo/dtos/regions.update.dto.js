"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regionsUpdateDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const regions_empresa_schema_1 = require("../schemas/regions_empresa.schema");
exports.regionsUpdateDto = (0, valibot_1.pickAsync)(regions_empresa_schema_1.regionsEmpresaSchema, [
    "priceShipping",
    "enabled",
    "days",
]);
