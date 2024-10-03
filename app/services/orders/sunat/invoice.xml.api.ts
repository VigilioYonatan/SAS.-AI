import enviroments from "~/config/enviroments.config";
import type { SunatInvoiceDto } from "./dtos/sunat.invoice.dto";
import { BadRequestException } from "@vigilio/express-core";

export async function invoiceXMLSunatApi(body: SunatInvoiceDto) {
    const response = await fetch(
        `${enviroments.VITE_VIGILIO_SUNAT}/api/invoices/xml`,
        {
            body: JSON.stringify(body),
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    const result = await response.text();

    if (!response.ok)
        throw new BadRequestException(
            "Hubo un error, Posible Error: certificado digital o contraseña de certificado digital, sino comunicarte con la empresa,"
        );
    return result;
}
