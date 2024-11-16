import { type Input, omitAsync } from "@vigilio/valibot";
import { empresasSchema } from "../schemas/empresas.schema";

export const empresasUpdateDto = omitAsync(empresasSchema, [
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
    "photo",
    "timeWhatsapp",
    "impuestos",
    "logo_pwa",
    "tz",
    "whatsapp_mode",
    "isFreeVPS",
    "isTemplate",
]);
export type EmpresasUpdateDto = Input<typeof empresasUpdateDto>;
