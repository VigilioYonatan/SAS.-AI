import numeroALetras from "@vigilio/numeros-a-letras";
import { formatDateTwo } from "~/libs/dayjs";
import { formatMoney, subtotal } from "@/cart/libs/helpers";
import type { Orders } from "../entities/orders.entity";
import type { Empresas } from "@/empresas/entities/empresas.entity";
import type { Invoices } from "../entities/invoices.entity";
import type { Address } from "@/empresas/entities/address.entity";
import { detailInvoice } from ".";
import { printFileWithDimension } from "@/uploads/libs/helpers";
import { MONEYDOLARES } from "~/libs/helpers";
import { pasarelaComision, paypalComision } from "@/payments/libs";
import type { Users } from "@/users/entities/users.entity";
import type { PayMethods } from "../entities/pay_methods.entity";
import type { Clients } from "@/users/entities/clients.entity";

export async function ticketHTML(order: Orders, empresa: Empresas) {
    const mapped = await detailInvoice(
        empresa,
        order.dataValues.details_orders,
        order,
    );

    const igv = mapped.reduce(
        (total, i) => total + Number(i.totalImpuestos.toFixed(2)),
        0
    );
    const region = order.city_id ? order.dataValues.city.region : null;
    const ig = region
        ? order.igv
            ? subtotal(region.priceShipping, empresa.igv, true)
            : region.priceShipping
        : 0;
    const money = order.moneyChange === 1 ? empresa.money.money : MONEYDOLARES;

    const mappedDetails = mapped.map((prod) => {
        return `<tr class="border_top">
        <td align="center">
           ${prod.cantidad}
            NIU
        </td>
        <td align="center">
            ${prod.codProducto}
        </td>
        <td align="center" width="300px">
            <span>${prod.descripcion}</span><br>
        </td>
        <td align="center">
            ${formatMoney(empresa, prod.mtoValorUnitario, money)}
        </td>
        <td align="center">
            ${formatMoney(empresa, prod.mtoValorVenta, money)}
        </td>
    </tr>`;
    });

    let total =
        (order.pasarela_comision && order.is_pasarela_client
            ? order.total +
              pasarelaComision(
                  empresa,
                  order.total,
                  order.type_pasarela ?? "normal"
              )
            : order.total) / order.moneyChange;
    if (order.paypal_token) {
        total = order.is_pasarela_client
            ? paypalComision(order.total, order.moneyChange)
            : order.total / order.moneyChange;
    }
    const moneyLetter =
        order.moneyChange === 1
            ? numeroALetras(
                  total,
                  true,
                  MONEDASIMBOLO[
                      empresa.money.simbolo as keyof typeof MONEDASIMBOLO
                  ]
              )
            : numeroALetras(total, true, {
                  isInvoice: true,
                  Monedasingular: "DOLAR",
                  centPlural: "CENTAVOS",
                  centSingular: "CENTAVO",
                  Monedaplural: "DOLARES",
              });

    return /*html*/ `
                <!DOCTYPE html>
                    <html lang="es">
                    <head>
                        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                        <title>Invoice</title>
                        <style type="text/css">.bold,b,strong{font-weight:700}body{background-repeat:no-repeat;background-position:center center;text-align:center;margin:0;font-family: Verdana, monospace}  .tabla_borde{border:1px solid #666;border-radius:10px}  tr.border_bottom td{border-bottom:1px solid #000}  tr.border_top td{border-top:1px solid #666}td.border_right{border-right:1px solid #666}.table-valores-totales tbody>tr>td{border:0}  .table-valores-totales>tbody>tr>td:first-child{text-align:right}  .table-valores-totales>tbody>tr>td:last-child{border-bottom:1px solid #666;text-align:right;width:30%}  hr,img{border:0}  table td{font-size:12px}  html{font-family:sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;font-size:10px;-webkit-tap-highlight-color:transparent}  a{background-color:transparent}  a:active,a:hover{outline:0}  img{vertical-align:middle}  hr{height:0;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;margin-top:20px;margin-bottom:20px;border-top:1px solid #eee}  table{border-spacing:0;border-collapse:collapse}@media print{blockquote,img,tr{page-break-inside:avoid}*,:after,:before{color:#000!important;text-shadow:none!important;background:0 0!important;-webkit-box-shadow:none!important;box-shadow:none!important}a,a:visited{text-decoration:underline}a[href]:after{content:" (" attr(href) ")"}blockquote{border:1px solid #999}img{max-width:100%!important}p{orphans:3;widows:3}.table{border-collapse:collapse!important}.table td{background-color:#fff!important}}  a,a:focus,a:hover{text-decoration:none}  *,:after,:before{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}  a{color:#428bca;cursor:pointer}  a:focus,a:hover{color:#2a6496}  a:focus{outline:dotted thin;outline:-webkit-focus-ring-color auto 5px;outline-offset:-2px}  h6{font-family:inherit;line-height:1.1;color:inherit;margin-top:10px;margin-bottom:10px}  p{margin:0 0 10px}  blockquote{padding:10px 20px;margin:0 0 20px;border-left:5px solid #eee}  table{background-color:transparent}  .table{width:100%;max-width:100%;margin-bottom:20px}  h6{font-weight:100;font-size:10px}  body{line-height:1.42857143;font-family:"open sans","Helvetica Neue",Helvetica,Arial,sans-serif;background-color:#2f4050;font-size:13px;color:#676a6c;overflow-x:hidden}  .table>tbody>tr>td{vertical-align:top;border-top:1px solid #e7eaec;line-height:1.42857;padding:8px}  .white-bg{background-color:#fff}  td{padding:6}  .table-valores-totales tbody>tr>td{border-top:0 none!important}
                        </style>
                    </head>
                    <body style="padding:10px; !important;background-color:white;">
                    <table width="100%">
                        <tbody><tr>
                            <td>
                                <table width="100%" height="200px" border="0" aling="center" cellpadding="0" cellspacing="0">
                                    <tbody>
                                    <tr>
                                        <td width="100%" height="90" align="center">
                                            <span>
                                            ${
                                                empresa.logo
                                                    ? `<img src="${
                                                          printFileWithDimension(
                                                              empresa
                                                          )(
                                                              empresa.logo,
                                                              100
                                                          )[0]
                                                      }" height="80" style="text-align:center;" border="0">`
                                                    : `<span style="font-size:4rem;font-weight:bolder;">${
                                                          empresa.company
                                                              ? empresa.company
                                                                    .nombreComercial[0]
                                                              : empresa
                                                                    .name_empresa[0]
                                                      }</span>`
                                            }
                                          </span>
                                        </td>                
                                    </tr>
                                    <tr>
                                        <td width="100%" rowspan="2" valign="bottom" style="padding-left:0">
                                            <div class="tabla_borde">
                                                <table width="100%" border="0"  cellpadding="0" cellspacing="0">
                                                    <tbody><tr>
                                                        <td align="center">
                                                            <span style="font-family:Tahoma, Geneva, sans-serif; font-size:29px" text-align="center">R E C I B O</span>
                                                        </td>
                                                    </tr>
                                                   <tr>
                                                        <td align="center">
                                                            <span style="font-size:15px" text-align="center"> ${
                                                                empresa.company
                                                                    ? `R.U.C.:${empresa.company.ruc}`
                                                                    : empresa.name_empresa
                                                            }</span>
                                                        </td>
                                                    </tr>
                                                    
                                                    <tr>
                                                        <td align="center">
                                                            <span style="font-size:24px">${
                                                                (
                                                                    order
                                                                        .dataValues
                                                                        .invoice as Invoices
                                                                ).serie
                                                            }-${
        (order.dataValues.invoice as Invoices).correlativo
    }</span>
                                                        </td>
                                                    </tr>
                                                    </tbody></table>
                                            </div>
                                        </td>
                                    </tr>      
                                    </tbody></table>
                                    <tr>
                                        <td width="100%" valign="bottom" style="padding-left:0">
                                            <div class="tabla_borde">
                                                <table width="100%" height="100%" border="0" border-radius="" cellpadding="3" cellspacing="0">
                                                    <tbody><tr>
                                                        <td align="center">
                                                            <strong><span style="font-size:15px">${
                                                                empresa.company
                                                                    ? empresa
                                                                          .company
                                                                          .razonSocial
                                                                    : empresa.name_empresa
                                                            }</span></strong>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td align="left">
                                                            <strong>Dirección: </strong>${
                                                                (
                                                                    empresa.address as Address
                                                                ).direccion
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td align="left">
                                                        <strong>Telf: </strong>${
                                                            empresa.telephoneFirst
                                                        }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td align="left">
                                                        <strong>Fecha: </strong>${formatDateTwo(
                                                            empresa,
                                                            (
                                                                order.dataValues
                                                                    .invoice as Invoices
                                                            ).createdAt
                                                        )}
                                                        </td>
                                                    </tr>
                                                    </tbody></table>
                                            </div>
                                        </td>
                                    </tr>
                                <br>
                               
                                <div class="tabla_borde">
                                    <table width="100%" border="0" cellpadding="5" cellspacing="0">
                                        <tbody>
                                            <tr>
                                                <td align="center" class="bold">Cantidad</td>
                                                <td align="center" class="bold">Código</td>
                                                <td align="center" class="bold">Descripción</td>
                                                <td align="center" class="bold">Valor Unitario</td>
                                                <td align="center" class="bold">Valor Total</td>
                                            </tr>
                                            ${mappedDetails}
                                        </tbody>
                                    </table></div>
                                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                    <tbody><tr>
                                        <td width="1000%" valign="top">
                                            <table width="100%" border="0" cellpadding="5" cellspacing="0">
                                                <tbody>
                                                <tr>
                                                    <td colspan="4">
                                                        <br>
                                                        <br>
                                                        <span style="font-family:Tahoma, Geneva, sans-serif; font-size:12px" text-align="center"><strong>${moneyLetter}.</strong></span>
                                                        <br>
                                                        <br>
                                                        <strong>Información Adicional</strong>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                            <table width="100%" border="0" cellpadding="5" cellspacing="0">
                                                <tbody>
                                                <tr class="border_top">
                                                    <td width="30%" style="font-size: 10px;">
                                                        LEYENDA:
                                                    </td>
                                                </tr>                 
                                                <tr class="border_top">
                                                    <td width="30%" style="font-size: 10px;">
                                                       CLIENTE:
                                                    </td>
                                                    <td width="70%" style="font-size: 10px;">
                                                        <p>
                                                        ${
                                                            order.client_id
                                                                ? (
                                                                      order.client as Clients
                                                                  ).fullname
                                                                : "Publico General"
                                                        } ${
        (order.invoice as Invoices)?.identification_number
            ? `- ${(order.invoice as Invoices)?.identification_number}`
            : ""
    }
                                                        </p>
                                                    </td>
                                                </tr>                 
                                                <tr class="border_top">
                                                    <td width="30%" style="font-size: 10px;">
                                                        CONDICION DE PAGO:
                                                    </td>
                                                    <td width="70%" style="font-size: 10px;">
                                                        <p>
                                                        ${
                                                            (
                                                                order.pay_method as PayMethods
                                                            ).name
                                                        }
                                                        </p>
                                                    </td>
                                                </tr>                 
                                                <tr class="border_top">
                                                    <td width="30%" style="font-size: 10px;">
                                                       VENDEDOR:
                                                    </td>
                                                    <td width="70%" style="font-size: 10px;">
                                                        <p>
                                                         ${
                                                             (
                                                                 order.user as Users
                                                             )?.name ?? ""
                                                         }  ${
        (order.user as Users)?.lastname ?? ""
    }
                                                        </p>
                                                    </td>
                                                </tr>                 
                                                </tbody>
                                            </table>
                                        </td>
                                        
                                    </tr><tr>
                                    <td width="100%" valign="top">
                                            <br>
                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" class="table table-valores-totales">
                                                <tbody>
                                                <tr>
                                                    <td align="right"><strong>Op. Gravadas:</strong></td>
                                                    <td width="120" align="right"><span id="ride-importeTotal" class="ride-importeTotal">${formatMoney(
                                                        empresa,
                                                        mapped.reduce(
                                                            (total, obj) =>
                                                                total +
                                                                obj.mtoBaseIgv,
                                                            0
                                                        ),
                                                        money
                                                    )}</span></td>
                                                </tr>
                                                <tr>
                                                    <td align="right"><strong>${empresa.tipo_impuesto
                                                        .toUpperCase()
                                                        .replaceAll(
                                                            "",
                                                            "."
                                                        )}:</strong></td>
                                                    <td width="120" align="right"><span id="ride-importeTotal" class="ride-importeTotal">${formatMoney(
                                                        empresa,
                                                        igv,
                                                        money
                                                    )}</span></td>
                                                </tr>
                                                <tr>
                                                    <td align="right"><strong>Precio Venta:</strong></td>
                                                    <td width="120" align="right"><span id="ride-importeTotal" class="ride-importeTotal">${formatMoney(
                                                        empresa,
                                                        total,
                                                        money
                                                    )}</span></td>
                                                </tr>
                                             
                                                </tbody>
                                            </table>
                                        </td></tr>
                                    </tbody></table>
                                <br>
                            </td>
                        </tr>
                        </tbody></table>
                    </body>
                    </html>`;
}

export const MONEDASIMBOLO = {
    PEN: {
        isInvoice: true,
        Monedasingular: "SOL",
        centPlural: "CÉNTIMOS",
        centSingular: "CÉNTIMO",
        Monedaplural: "SOLES",
    },
    ARS: {
        isInvoice: true,
        Monedasingular: "PESO",
        centPlural: "CENTAVOS",
        centSingular: "CENTAVO",
        Monedaplural: "PESOS",
    },
    BRL: {
        isInvoice: true,
        Monedasingular: "REAL",
        centPlural: "CENTAVOS",
        centSingular: "CENTAVO",
        Monedaplural: "REAIS",
    },
    USD: {
        isInvoice: true,
        Monedasingular: "DÓLAR",
        centPlural: "CENTAVOS",
        centSingular: "CENTAVO",
        Monedaplural: "DÓLARES",
    },
    CLP: {
        isInvoice: true,
        Monedasingular: "PESO",
        centPlural: "CENTAVOS",
        centSingular: "CENTAVO",
        Monedaplural: "PESOS",
    },
    MXN: {
        isInvoice: true,
        Monedasingular: "PESO",
        centPlural: "CENTAVOS",
        centSingular: "CENTAVO",
        Monedaplural: "PESOS",
    },
    COP: {
        isInvoice: true,
        Monedasingular: "PESO",
        centPlural: "CENTAVOS",
        centSingular: "CENTAVO",
        Monedaplural: "PESOS",
    },
    EUR: {
        isInvoice: true,
        Monedasingular: "EURO",
        centPlural: "CÉNTIMOS",
        centSingular: "CÉNTIMO",
        Monedaplural: "EUROS",
    },
};
