"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.empresasUpdateDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const empresas_schema_1 = require("../schemas/empresas.schema");
exports.empresasUpdateDto = (0, valibot_1.omitAsync)(empresas_schema_1.empresasSchema, [
    "id",
    "inteligenceArtificial",
    "contacts",
    "company",
    "whatsappconfig",
    "groupWhatsapp",
    "dial_code",
    "credentials",
    "payments",
    "money",
    "schedule",
    "type_empresa_id",
    "type_empresa_other",
    "port",
    "tipo_impuesto",
    "mercado_pago_comision",
    "certificado",
    "logo",
    "icon",
    "token",
    "timeWhatsapp",
    "impuestos",
    "logo_pwa",
    "tz",
    "whatsapp_mode",
    "isFreeVPS",
    "isTemplate",
    "versionamiento",
    "enabled_zoho_mail",
]);
