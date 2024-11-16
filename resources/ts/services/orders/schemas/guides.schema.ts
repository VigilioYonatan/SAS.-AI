import {
	boolean,
	coerce,
	date,
	minLength,
	minValue,
	nullable,
	number,
	object,
	string,
	type Input,
} from "@vigilio/valibot";
import { invoiceResponseSunat } from "./invoices.schema";

export const guidesSchema = object({
	id: number(),
	serie: string(),
	correlativo: string(),
	kind_guide_code: nullable(string()),
	destinatario: object({
		razon_social: string([minLength(1)]),
		document_code: string([minLength(1)]),
		identification_number: string([minLength(1)]),
	}),
	datos_envio: object({
		motivo_traslado: string([minLength(1)]),
		modalidad_traslado: string([minLength(1)]),
		fecha_initial_traslado: coerce(
			date(),
			(value) => new Date(value as string),
		),
		peso_total: number([minValue(0)]),
		unidad: string(),
		dato_transportista: object({
			razon_social: string([minLength(1)]),
			document_code: string([minLength(1)]),
			identification_number: string([minLength(1)]),
		}),
		punta_partida: object({
			address: string([minLength(1, "Este campo es obligatorio")]),
			ubigeo: string([minLength(1, "Este campo es obligatorio")]),
		}),
		punta_llegada: object({
			address: string([minLength(1, "Este campo es obligatorio")]),
			ubigeo: string([minLength(1, "Este campo es obligatorio")]),
		}),
	}),

	send_sunat: nullable(boolean()),
	response_sunat: nullable(invoiceResponseSunat),
	xml_path: nullable(string()),
	cdr_path: nullable(string()),
	order_id: number(),
	empresa_id: number(),
});
export type GuidesSchema = Input<typeof guidesSchema> & {
	createdAt?: Date;
	updatedAt?: Date;
};
