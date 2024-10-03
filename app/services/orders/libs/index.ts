import type { SunatInvoiceDto } from "../sunat/dtos/sunat.invoice.dto";
import type { InvoicesSchema } from "../schemas/invoices.schema";
import type { DetailOrdersStoreDto } from "../dtos/detail_orders.store.dto";
import type { NotesSchema } from "../schemas/notes.schema";
import type { SunatNoteDto } from "../sunat/dtos/sunat.note.dto";
import type { Invoices } from "../entities/invoices.entity";
import { Empresas } from "@/empresas/entities/empresas.entity";
import { pathUploads } from "@/uploads/libs/helpers";
import { invoicePDFSunatApi } from "../sunat/invoice.pdf.api";
import {
    InternalServerErrorException,
    NotFoundException,
} from "@vigilio/express-core";
import { invoiceXMLSunatApi } from "../sunat/invoice.xml.api";
import { notePDFSunatApi } from "../sunat/note.pdf.api";
import { noteXMLSunatApi } from "../sunat/note.xml.api";
import { subtotal } from "@/cart/libs/helpers";
import { KindCreditNotes } from "../entities/kind_credit_notes.entity";
import { KindDebitNotes } from "../entities/kind_debit_notes.entity";
import { ticketHTML } from "./ticket";
import { Orders } from "../entities/orders.entity";
import fs from "node:fs";
import type { Guides } from "../entities/guides.entity";
import type { GuidesSchema } from "../schemas/guides.schema";
import type { SunatGuideDto } from "../sunat/dtos/sunat.guide.dto";
import { pasarelaComision, paypalComision } from "@/payments/libs";
import type { DetailOrders } from "../entities/detail_orders.entity";
import { guidePDFSunatApi } from "../sunat/guide.pdf.api";
import { Product, productEntityId } from "@/products/libs";
import { Op, type WhereAttributeHash } from "sequelize";
import type { Cities } from "@/ubigeo/entities/cities.entity";
import type { Regions } from "@/ubigeo/entities/regions.entity";
import type { Address } from "@/empresas/entities/address.entity";
import { provincesSeeder } from "@/ubigeo/seeders/peru/provinces.seeder";
import { RegionsEmpresa } from "@/ubigeo/entities/regions_empresa.entity";
import { ProductsNormal } from "@/products/entities/products_normal.entity";
import { ProductsServicio } from "@/products/entities/products_servicio.entity";
import { ProductsRestaurant } from "@/products/entities/products_restaurant.entity";
import wkhtmltopdf from "wkhtmltopdf";
import { PassThrough } from "node:stream";

export const ordersTransferenciaImage = [800];

export const isValidDni = new RegExp(/^\d{8}$/);
export const isValiRUC = new RegExp(/^(10|20)\d{9}$/);

export type StatusOrdersType =
    | "pendiente"
    | "confirmado"
    | "preparado"
    | "enviando"
    | "pagado"
    | "entregado"
    | "problema";
export const STATUSORDER: Record<StatusOrdersType, number> = {
    pendiente: 1,
    confirmado: 2,
    preparado: 3,
    enviando: 4,
    pagado: 5,
    entregado: 6,
    problema: 7,
};
export type PayMethodType =
    | "efectivo"
    | "tarjeta"
    | "yape"
    | "paypal"
    | "transferencia"
    | "otro";
export const PAYMETHOD: Record<PayMethodType, number> = {
    efectivo: 1,
    tarjeta: 2,
    yape: 3,
    paypal: 4,
    transferencia: 5,
    otro: 6,
};

interface PdfGenerateProps {
    empresa: Empresas;
    type: "invoice" | "note" | "recibo" | "guide";
    sunat: SunatInvoiceDto | SunatNoteDto | SunatGuideDto | null;
    order: Orders;
}
// save: boolean save in filessystem
export async function pdfGenerate(props: PdfGenerateProps, save = false) {
    try {
        let pdf: string | null = null;
        if (props.type === "invoice") {
            pdf = await invoicePDFSunatApi(props.sunat as SunatInvoiceDto);
        }
        if (props.type === "note") {
            pdf = await notePDFSunatApi(props.sunat as SunatNoteDto);
        }
        if (props.type === "guide") {
            pdf = await guidePDFSunatApi(props.sunat as SunatGuideDto);
        }

        if (props.type === "recibo") {
            pdf = await ticketHTML(props.order, props.empresa);
        }

        const buffer = await generatePdfBuffer(pdf!, {
            pageWidth: "95mm",
            pageHeight: "385mm",
        });
        const nameFile = `/${props.empresa.slug}-${props.order.order_code}-${props.type}.pdf`;
        const file = `${props.empresa.slug}/sunat`;
        if (!fs.existsSync(`${pathUploads()}/${file}`)) {
            fs.mkdirSync(`${pathUploads()}/${file}`);
        }
        if (save) {
            if (fs.existsSync(`${pathUploads()}/${file}${nameFile}`)) {
                fs.unlinkSync(`${pathUploads()}/${file}${nameFile}`);
            }
            fs.writeFileSync(
                `${pathUploads()}/${file}${nameFile}`,
                buffer as Buffer
            );
        }
        return { file: `${file}${nameFile}`, pdfBuffer: buffer as Buffer };
    } catch (error) {
        throw new InternalServerErrorException(
            `PDF no se subio correctamente, comunicarte con desarrollador, Posible error: no está disponible web de factura, ${
                (error as Error).message
            }`
        );
    }
}
export async function xmlGenerate(props: PdfGenerateProps) {
    let xml: string | null = null;
    if (props.type === "invoice") {
        xml = await invoiceXMLSunatApi(props.sunat as SunatInvoiceDto);
    }
    if (props.type === "note") {
        xml = await noteXMLSunatApi(props.sunat as SunatNoteDto);
    }
    const nameFile = `/${props.empresa.slug}-${props.order.order_code}-${props.type}.xml`;
    const file = `${props.empresa.slug}/sunat`;
    if (!fs.existsSync(`${pathUploads()}/${file}`)) {
        fs.mkdirSync(`${pathUploads()}/${file}`);
    }
    if (fs.existsSync(`${pathUploads()}/${file}${nameFile}`)) {
        fs.unlinkSync(`${pathUploads()}/${file}${nameFile}`);
    }
    fs.writeFileSync(`${pathUploads()}/${file}${nameFile}`, xml!);
    return `${file}${nameFile}`;
}

export function generatePdfBuffer(
    html: string,
    options: { pageWidth: string; pageHeight: string }
): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const output = new PassThrough();
        const chunks: Uint8Array[] = [];

        wkhtmltopdf(html, options, (err) => {
            if (err) {
                reject(err.message);
            }
        }).pipe(output);

        output.on("data", (chunk) => {
            chunks.push(chunk);
        });

        output.on("end", () => {
            resolve(Buffer.concat(chunks) as Buffer);
        });

        output.on("error", (err) => {
            reject(err);
        });
    });
}

export async function crdGenerate(props: {
    empresa: Empresas;
    orderCode: string;
    cdrzip: string;
}) {
    const file = `${props.empresa.slug}/sunat/${props.empresa.slug}-${
        props.orderCode
    }-${Date.now().toString(32).slice(3)}.cdr`;
    if (fs.existsSync(`${pathUploads()}/${file}`)) {
        fs.unlinkSync(`${pathUploads()}/${file}`);
    }
    fs.writeFileSync(`${pathUploads()}/${file}`, props.cdrzip);
    return file;
}

interface OnInvoiceSunatProps {
    invoice: Pick<
        InvoicesSchema,
        | "document_code"
        | "razon_social"
        | "identification_number"
        | "kind_invoice_code"
        | "correlativo"
        | "serie"
        | "createdAt"
    >;
    detail_orders: DetailOrdersStoreDto[];
    empresa: Empresas;
    order: Orders;
    vendedor: string;
}

// https://www.sunat.gob.pe/legislacion/superin/2015/anexoI-274-2015.pdf
export async function onInvoiceSunat({
    invoice,
    detail_orders,
    empresa,
    order,
    vendedor,
}: OnInvoiceSunatProps): Promise<SunatInvoiceDto> {
    const client: SunatInvoiceDto["client"] = {
        tipoDoc: invoice.identification_number ? invoice.document_code : "0",
        rznSocial: invoice.razon_social ?? "Cliente General",
        numDoc: invoice.identification_number ?? "00000000",
    } as SunatInvoiceDto["client"];
    const addressEmpresa = (empresa as Empresas).address as Address;
    const address = {
        ubigeo: (addressEmpresa.city as Cities).code,
        departamento: ((addressEmpresa.city as Cities).region as Regions).name,
        provincia: provincesSeeder.find(
            (pro) =>
                pro.department_id ===
                ((addressEmpresa.city as Cities).region as Regions).code
        )?.name!,
        distrito: (addressEmpresa.city as Cities).name,
        urbanizacion: addressEmpresa.urbanizacion,
        direccion: addressEmpresa.direccion,
        codLocal: addressEmpresa.codLocal,
    };
    const details = await detailInvoice(empresa, detail_orders, order);

    return {
        ublVersion: "2.1",
        tipoOperacion: "0101",
        tipoDoc: invoice.kind_invoice_code, //boleta o factura
        serie: invoice.serie,
        correlativo: String(invoice.correlativo),
        // paypal solo permite dolares
        tipoMoneda: order.moneyChange === 1 ? "PEN" : "USD", // aca si deseas cambiar a dolar
        fechaEmision: invoice.createdAt
            ? new Date(invoice.createdAt!)
            : new Date(),
        formaPago: {
            moneda: order.moneyChange === 1 ? "PEN" : "USD", // aca si deseas cambiar a dolar
            tipo: "Contado",
        },
        client,
        details,
        company: {
            logo: empresa.logo
                ? fs
                      .readFileSync(
                          `${pathUploads()}/${empresa.slug}/${
                              empresa.logo[0].file
                          }` // trae a la imagen 100px
                      )
                      .toString("base64")
                : "", //si no existe logo que envie un string vacio
            certificado: empresa.certificado
                ? fs
                      .readFileSync(
                          `${pathUploads()}/${empresa.slug}/${
                              empresa.certificado[0].file
                          }` // trae a la imagen 100px
                      )
                      .toString("base64")
                : null,
            condicion_pago: "Efectivo",
            telephone: empresa.telephoneFirst,
            vendedor,
            address,
            ...empresa.company!,
        },
    };
}

interface OnNoteSunatProps {
    note: Pick<
        NotesSchema,
        | "kind_invoice_code"
        | "document_code"
        | "razon_social"
        | "identification_number"
        | "correlativo"
        | "kind_credit_notes_code"
        | "kind_debit_notes_code"
        | "serie"
        | "createdAt"
    >;
    invoice: Pick<
        InvoicesSchema,
        "serie" | "correlativo" | "kind_invoice_code" | "createdAt"
    >;
    detail_orders: DetailOrdersStoreDto[];
    empresa: Empresas;
    order: Orders;
    vendedor: string;
}

export async function onNoteSunat({
    note,
    detail_orders,
    empresa,
    invoice,
    order,
    vendedor,
}: OnNoteSunatProps): Promise<SunatNoteDto> {
    //  si existe kind_credit_notes_code entonces mostrarme name de kind_credit_notes_code sino de  kind_debit_notes_code
    const notekind =
        note.kind_invoice_code === "07"
            ? await KindCreditNotes.findByPk(note.kind_credit_notes_code!)
            : await KindDebitNotes.findByPk(note.kind_debit_notes_code!);

    const client: SunatInvoiceDto["client"] = {
        tipoDoc: note.identification_number ? note.document_code : "0",
        rznSocial: note.razon_social ?? "Cliente General",
        numDoc: note.identification_number ?? "00000000",
    } as SunatInvoiceDto["client"];
    const addressEmpresa = (empresa as Empresas).address as Address;
    const address = {
        ubigeo: (addressEmpresa.city as Cities).code,
        departamento: ((addressEmpresa.city as Cities).region as Regions).name,
        provincia: provincesSeeder.find(
            (pro) =>
                pro.department_id ===
                ((addressEmpresa.city as Cities).region as Regions).code
        )?.name!,
        distrito: (addressEmpresa.city as Cities).name,
        urbanizacion: addressEmpresa.urbanizacion,
        direccion: addressEmpresa.direccion,
        codLocal: addressEmpresa.codLocal,
    };
    const details = await detailInvoice(empresa, detail_orders, order);
    return {
        ublVersion: "2.1",
        tipoOperacion: "0101",
        correlativo: String(note.correlativo),
        tipoDoc: note.kind_invoice_code, // nota de credito o debito
        serie: note.serie,
        codMotivo:
            note.kind_invoice_code === "07"
                ? note.kind_credit_notes_code!
                : note.kind_debit_notes_code!,
        desMotivo: notekind!.name,
        numDocfectado: `${invoice.serie}-${invoice.correlativo}`,
        tipDocAfectado: invoice.kind_invoice_code,
        tipoMoneda: order.moneyChange === 1 ? "PEN" : "USD", // aca si deseas cambiar a dolar
        fechaEmision: note.createdAt ? new Date(note.createdAt!) : new Date(),
        formaPago: {
            moneda: order.moneyChange === 1 ? "PEN" : "USD", // aca si deseas cambiar a dolar
            tipo: "Contado",
        },
        client,
        details,
        company: {
            logo: empresa.logo
                ? fs
                      .readFileSync(
                          `${pathUploads()}/${empresa.slug}/${
                              empresa.logo[0].file
                          }` // trae a la imagen 100px
                      )
                      .toString("base64")
                : "", //si no existe logo que envie un string vacio
            certificado: empresa.certificado
                ? fs
                      .readFileSync(
                          `${pathUploads()}/${empresa.slug}/${
                              empresa.certificado[0].file
                          }` // trae a la imagen 100px
                      )
                      .toString("base64")
                : null,
            condicion_pago: "Efectivo",
            telephone: empresa.telephoneFirst,
            vendedor,
            address,
            ...empresa.company!,
        },
    };
}
interface OnGuideSunatProps {
    guide: Omit<
        GuidesSchema,
        "cdr_path" | "xml_path" | "order_id" | "response_sunat" | "id"
    >;
    detail_orders: DetailOrdersStoreDto[];
    empresa: Empresas;
    order: Orders;
    vendedor: string;
}

export async function onGuideSunat({
    guide,
    detail_orders,
    empresa,
    order,
    vendedor,
}: OnGuideSunatProps): Promise<SunatGuideDto> {
    const addressEmpresa = (empresa as Empresas).address as Address;
    const address = {
        ubigeo: (addressEmpresa.city as Cities).code,
        departamento: ((addressEmpresa.city as Cities).region as Regions).name,
        provincia: provincesSeeder.find(
            (pro) =>
                pro.department_id ===
                ((addressEmpresa.city as Cities).region as Regions).code
        )?.name!,
        distrito: (addressEmpresa.city as Cities).name,
        urbanizacion: addressEmpresa.urbanizacion,
        direccion: addressEmpresa.direccion,
        codLocal: addressEmpresa.codLocal,
    };

    const items = await detailInvoice(empresa, detail_orders, order);
    return {
        version: "2022",
        correlativo: String(guide.correlativo),
        tipoDoc: guide.kind_guide_code, // guia
        serie: guide.serie,
        fechaEmision: guide.createdAt ? new Date(guide.createdAt!) : new Date(),
        destinatario: {
            numDoc: guide.destinatario.identification_number,
            rznSocial: guide.destinatario.razon_social,
            tipoDoc: guide.destinatario.document_code,
        },
        envio: {
            codTraslado: guide.datos_envio.motivo_traslado,
            modTraslado: guide.datos_envio.modalidad_traslado,
            fecTraslado: guide.datos_envio.fecha_initial_traslado,
            llegada: {
                direccion: guide.datos_envio.punta_llegada.address,
                ubigeo: guide.datos_envio.punta_llegada.ubigeo,
            },
            partida: {
                direccion: guide.datos_envio.punta_partida.address,
                ubigeo: guide.datos_envio.punta_partida.ubigeo,
            },
            transportista: {
                numDoc: guide.datos_envio.dato_transportista
                    .identification_number,
                rznSocial: guide.datos_envio.dato_transportista.razon_social,
                tipoDoc: guide.datos_envio.dato_transportista.document_code,
            },
            pesoTotal: guide.datos_envio.peso_total,
            undPesoTotal: guide.datos_envio.unidad,
        },
        details: items.map((prod) => ({
            codigo: prod.codProducto,
            descripcion: prod.descripcion,
            unidad: prod.unidad,
            cantidad: prod.cantidad,
        })),
        company: {
            logo: empresa.logo
                ? fs
                      .readFileSync(
                          `${pathUploads()}/${empresa.slug}/${
                              empresa.logo[0].file
                          }` // trae a la imagen 100px
                      )
                      .toString("base64")
                : "", //si no existe logo que envie un string vacio
            certificado: empresa.certificado
                ? fs
                      .readFileSync(
                          `${pathUploads()}/${empresa.slug}/${
                              empresa.certificado[0].file
                          }` // trae a la imagen 100px
                      )
                      .toString("base64")
                : null,
            condicion_pago: "Efectivo",
            telephone: empresa.telephoneFirst,
            vendedor,
            address,
            ...empresa.company!,
        },
    };
}

export async function getOrder(
    empresa: Empresas,
    order: Orders,
    showDetailsOrder = true
) {
    const [details_orders, invoice, guide] = await Promise.all([
        showDetailsOrder
            ? order.$get("details_orders", {
                  include: [
                      {
                          model: ProductsNormal,
                          attributes: [
                              "id",
                              "product_code",
                              "name",
                              "images",
                              "slug",
                          ],
                      },
                      {
                          model: ProductsServicio,
                          attributes: [
                              "id",
                              "product_code",
                              "name",
                              "images",
                              "slug",
                          ],
                      },
                      {
                          model: ProductsRestaurant,
                          attributes: [
                              "id",
                              "product_code",
                              "name",
                              "images",
                              "slug",
                          ],
                      },
                  ],
              })
            : [],
        order.$get("invoice") as Promise<Invoices>,
        order.$get("guide") as Promise<Guides>,
    ]);
    let note = null;
    if (invoice) {
        note = await invoice.$get("note");
    }

    order.dataValues.guide = guide;
    order.dataValues.invoice = invoice;
    if (showDetailsOrder) {
        order.dataValues.details_orders = details_orders;
    }
    order.dataValues.note = note;
    let city = null;
    if (order.city) {
        const regionsEmpresa = await RegionsEmpresa.findOne({
            where: {
                empresa_id: empresa.id,
                region_id: (order.city as Cities).region_id,
            },
        });
        city = {
            ...(order.city as Cities),
            days: regionsEmpresa?.days,
            enabled: regionsEmpresa?.enabled,
            priceShipping: regionsEmpresa?.priceShipping,
        };
    }
    order.dataValues.city = city;
    return order;
}
export async function detailInvoice(
    empresa: Empresas,
    detail_orders: DetailOrdersStoreDto[],
    order: Orders
) {
    const IGV = order.igv ? empresa.igv : 0;
    const lengthDetails = (
        order.dataValues.details_orders as DetailOrders[]
    ).reduce((total, obj) => total + obj.quantity, 0);
    const region = order.city_id ? order.dataValues.city.region : null;
    const ig = region
        ? order.igv
            ? subtotal(region.priceShipping, empresa.igv, true)
            : region.priceShipping
        : 0;

    const details: SunatInvoiceDto["details"] = await Promise.all(
        detail_orders.map(async (prod) => {
            const product = await Product(empresa).findOne({
                where: {
                    id: prod[productEntityId(empresa) as keyof typeof prod],
                    empresa_id: empresa.id,
                },
            });
            if (!product)
                throw new NotFoundException(
                    `Hubo un error al encontrar este producto ${
                        prod[productEntityId(empresa) as keyof typeof prod]
                    }`
                );
            const priceWithoutIGV: number = order!.igv // dividir  con la cantida para obtener el precio original del producto
                ? prod.price / ((100 + IGV) / 100) / prod.quantity
                : prod.price / prod.quantity;

            let priceWithPasarelaCommission: number = priceWithoutIGV;
            const total = order.total - ig;
            if (order.is_pasarela_client) {
                if (order.pasarela_comision) {
                    const totalw = total / ((100 + IGV) / 100);
                    priceWithPasarelaCommission =
                        (totalw + pasarelaComision(empresa, totalw)) /
                        lengthDetails;
                }

                if (order.paypal_token) {
                    priceWithPasarelaCommission =
                        (paypalComision(
                            total / ((100 + IGV) / 100),
                            order.moneyChange
                        ) *
                            order.moneyChange) /
                        lengthDetails;
                }
            }

            return {
                tipAfeIgv: 10, // catalogo 7
                codProducto: product.product_code,
                descripcion: product.name,
                unidad: "NIU",
                cantidad: prod.quantity, // cantidad de producto
                mtoValorUnitario:
                    priceWithPasarelaCommission / order.moneyChange, //precio sin igv
                mtoValorVenta:
                    (priceWithPasarelaCommission * prod.quantity) /
                    order.moneyChange, // precio sin igv * cantidad
                mtoBaseIgv:
                    (priceWithPasarelaCommission * prod.quantity) /
                    order.moneyChange, // mismo mtoValorVenta
                mtoPrecioUnitario:
                    subtotal(priceWithPasarelaCommission, IGV, true) /
                    order.moneyChange, // MONTO INCLUYENDO IGV
                igv:
                    (priceWithPasarelaCommission *
                        prod.quantity *
                        (IGV / 100)) /
                    order.moneyChange,
                totalImpuestos:
                    (priceWithPasarelaCommission *
                        prod.quantity *
                        (IGV / 100)) /
                    order.moneyChange,
                porcentajeIgv: IGV,
                factorIcbper: null,
                icbper: null,
            };
        })
    );
    if (region && region.priceShipping > 0) {
        details.push({
            tipAfeIgv: 10, // catalogo 7
            codProducto: "0",
            descripcion: `Precio de Envio - ${region.name}`,
            unidad: "NIU",
            cantidad: 1, // cantidad de producto
            mtoValorUnitario: region.priceShipping / order.moneyChange, //precio sin igv
            mtoValorVenta: region.priceShipping / order.moneyChange, // precio sin igv * cantidad
            mtoBaseIgv: region.priceShipping / order.moneyChange, // mismo mtoValorVenta
            mtoPrecioUnitario:
                subtotal(region.priceShipping, IGV, true) / order.moneyChange, // MONTO INCLUYENDO IGV
            igv: (region.priceShipping * (IGV / 100)) / order.moneyChange,
            totalImpuestos:
                (region.priceShipping * (IGV / 100)) / order.moneyChange,
            porcentajeIgv: IGV,
            factorIcbper: null,
            icbper: null,
        });
    }

    return details;
}
export async function usersMostOrders(
    empresa: Empresas,
    date: WhereAttributeHash
) {
    const orders = await Orders.unscoped().findAll({
        where: {
            status_order_id: STATUSORDER.pagado,
            client_id: {
                [Op.ne]: null,
            },
            empresa_id: empresa.id,
            ...date,
        },
        attributes: ["id", "client_id"],
    });
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const groupedById: any = {};
    // Iterar sobre el array original
    for (const item of orders) {
        const id = item.client_id!;
        // Si el "id" ya existe en el objeto agrupado, incrementa la cantidad
        if (groupedById[id]) {
            groupedById[id].cantidad++;
        } else {
            // Si no existe, crea una nueva entrada en el objeto agrupado
            groupedById[id] = {
                id: id,
                cantidad: 1,
                user: item.user,
            };
        }
    }
    // Convertir el objeto agrupado de nuevo a un array
    const arrayGroup = Object.values(groupedById).sort(
        (a, b) =>
            (b as { cantidad: number }).cantidad -
            (a as { cantidad: number }).cantidad
    );
    return arrayGroup;
}
