import { type Input, omitAsync } from "@vigilio/valibot";
import { informationSchema } from "../schemas/information.schema";

export const informationUpdateDto = omitAsync(informationSchema, [
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
	"pricing",
]);
export type InformationUpdateDto = Input<typeof informationUpdateDto>;
