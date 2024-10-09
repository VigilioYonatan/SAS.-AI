import enviroments from "~/config/enviroments.config";
import type { SunatInvoiceDto } from "./dtos/sunat.invoice.dto";
import { BadRequestException } from "@vigilio/express-core";
import type { InvoiceResponseSunat } from "../schemas/invoices.schema";

export async function invoiceSendSunatApi(body: SunatInvoiceDto) {
	const response = await fetch(
		`${enviroments.VITE_VIGILIO_SUNAT}/api/invoices/send`,
		{
			body: JSON.stringify(body),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		},
	);

	const result: InvoiceSunatAPI = await response.json();
	if (!response.ok)
		throw new BadRequestException(
			"Hubo un error, Posible Error: certificado digital o contraseña de certificado digital, sino comunicarte con la empresa,",
		);
	return result;
}

export interface InvoiceSunatAPI {
	sunatResponse: InvoiceResponseSunat & { success: boolean; cdrZip: string };
	hash: string;
}
export interface InvoiceSunatErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
