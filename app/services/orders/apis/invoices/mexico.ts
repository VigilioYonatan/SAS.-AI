import Facturapi from "facturapi";
import type { Product } from "whatsapp-web.js";
interface InvoiceMexico {
    customer: CustomerMexico;
    items: {
        product: {
            description: string;
            product_key: string;
            price: number;
            tax_included: boolean;
        };
        quantity: number;
    }[];
    payment_method: string;
    folio_number: number;
    series: string;
    currency: "MXN" | "USD";
    date: Date;
    use: string;
}

interface CustomerMexico {
    legal_name: string; // Razón social
    tax_id: string; // RFC
    email?: string; // Correo electrónico (opcional)
    address: {
        street: string; // Calle
        exterior: string; // Número exterior
        neighborhood: string; // Colonia
        zip: string; // Código postal
        // Puedes añadir más campos si es necesario
    };
}

export async function createCustomerMexico(
    api_key: string,
    body: CustomerMexico
) {
    try {
        const facturapi = new Facturapi(api_key, { apiVersion: "v2" });
        const result = await facturapi.customers.create(body);
        return result;
    } catch (error) {}
}

// producto
export async function createProductMexico(
    api_key: string,
    body: {
        description: string;
        product_key: string;
        price: number;
        tax_included: boolean;
    }
) {
    try {
        const facturapi = new Facturapi(api_key, { apiVersion: "v2" });
        const result = await facturapi.products.create(body);
        return result;
    } catch (error) {}
}
export async function editProductMexico(
    api_key: string,
    id: Product,
    body: {
        description: string;
        product_key: string;
        price: number;
        tax_included: boolean;
    }
) {
    try {
        const facturapi = new Facturapi(api_key, { apiVersion: "v2" });
        const result = await facturapi.products.create(body);
        return result;
    } catch (error) {}
}
export async function createInvoiceMexico(
    api_key: string,
    body: InvoiceMexico
) {
    try {
        const facturapi = new Facturapi(api_key, { apiVersion: "v2" });
        const result = await facturapi.customers.create(body);
        return result;
    } catch (error) {}
}
