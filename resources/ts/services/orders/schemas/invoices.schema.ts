import {
	number,
	string,
	type Input,
	nullable,
	boolean,
	object,
} from "@vigilio/valibot";
import type { OrdersSchema } from "./orders.schema";

export const invoiceResponseSunat = object({
	cdrResponse: object({ code: number(), description: string() }),
	error: object({ code: string(), message: string() }),
});
export type InvoiceResponseSunat = Input<typeof invoiceResponseSunat>;

export const invoicesSchema = object({
	id: number(),
	serie: string(),
	correlativo: string(),
	kind_invoice_code: string(),
	document_code: nullable(string("Documento no válido")),
	identification_number: nullable(string("Documento de identidad no válido")),
	razon_social: nullable(string("Razón social no válido")),
	send_sunat: nullable(boolean()),
	response_sunat: nullable(invoiceResponseSunat),
	xml_path: nullable(string()),
	cdr_path: nullable(string()),
	order_id: number(),
	empresa_id: number(),
});

export type InvoicesSchema = Input<typeof invoicesSchema> & {
	createdAt?: Date;
	updatedAt?: Date;
};
export type InvoicesSchemaFromServer = InvoicesSchema & {
	order: Pick<OrdersSchema, "id" | "order_code">;
};
