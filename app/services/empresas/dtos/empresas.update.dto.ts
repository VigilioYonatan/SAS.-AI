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
    "token",
    "timeWhatsapp",
    "impuestos",
    "tz",
]);
export type EmpresasUpdateDto = Input<typeof empresasUpdateDto>;
