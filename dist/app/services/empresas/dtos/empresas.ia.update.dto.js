"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.empresasIAUpdateDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const empresas_schema_1 = require("../schemas/empresas.schema");
exports.empresasIAUpdateDto = (0, valibot_1.pickAsync)(empresas_schema_1.empresasSchema, [
    "inteligenceArtificial",
]);
