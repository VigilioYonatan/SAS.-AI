import type { Empresas } from "@/empresas/entities/empresas.entity";
import { printFileWithDimension } from "@/uploads/libs/helpers";

interface CustomEmailHTMLProps {
    empresa: Empresas;
    namecomplete: string;
    title: string;
    content: string;
}
export function customEmailHTML({
    empresa,
    namecomplete,
    title,
    content,
}: CustomEmailHTMLProps) {
    const logo = empresa.logo
        ? printFileWithDimension(empresa)(empresa.logo, 100)
        : "";
    console.log({ logo });

    return /*html*/ `<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <style>   /* animation */
            .animation-brightness {
                position: relative;
                overflow: hidden;
            }
            .animation-brightness::before {
                content: "";
                position: absolute;
                color: white;
                display: block;
                top: 0;
                right: 0;
                bottom: 0;
                z-index: 10;
                width: 70%;
                height: 100%;
                background: linear-gradient(
                    to right,
                    rgba(255, 255, 255, 0) 0%,
                    rgba(255, 255, 255, 0.3) 100%
                );
                /* box-shadow: 0 0 10px 10px #ffffff46; */
                animation: animationbrightness var(--brightness-delay) infinite;
            }
            @keyframes animationbrightness {
                    0% {
                        transform: skewX(-25deg) translateX(-1000%);
                    }
                    50% {
                        transform: skewX(-25deg) translateX(1000%);
                    }
                    100% {
                        transform: skewX(-25deg) translateX(1000%);
                    }
                }
        </style>
    </head>
    <body >
      <div style="background-color:#f4f4f4;padding-top:50px;padding-bottom:50px">
    <div class="adM">
    </div>
    <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%;max-width:750px;background-color:#fff">
      <thead>
        <tr>
          <td>
            <div  class="animation-brightness" style="background-color:${
                empresa!.setting.bg_color
            }; height: 100px;width: 100%;display: flex;justify-content: space-between;align-items: center; --brightness-delay:12s;">
              <img width="100" height="100" style="object-fit: contain;" src="${logo}" alt="${
        empresa.name_empresa
    }">
              <span style="color:#000;font-family:'Nunito Sans rev=2',sans-serif!important;font-weight:bolder!important;line-height:1.6!important;color: #fff!important;font-size: 1.2rem!important;margin: 0px 1rem;">${
                  empresa.company?.razonSocial || empresa.name_empresa
              }</span>
            </div>
          </td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding:40px 30px 0px 30px;font-size:14px!important;color:#363636;font-family:'Nunito Sans rev=2',sans-serif!important;font-weight:400!important;line-height:1.6!important">
            <div>
              <div>
                <p><strong><span style="color:#000000;font-size: 1.2rem;">${title}</span></strong></p>
                <p><strong><span style="color:#${
                    empresa!.setting.bg_color
                }">Hola ${namecomplete},</span></strong></p>
                <div>
                <div>
                  ${content}
                </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:30px 30px 40px 30px;font-size:15px;color:${
              empresa!.setting.bg_color
          };font-family:'Nunito Sans rev=3',sans-serif">
            <p><b>Equipo ${empresa.name_empresa}</b></p>
          </td>
        </tr>
      </tbody>
      <tfoot style="font-size:11px;font-family:'Nunito Sans',sans-serif;padding-top:12px;padding-bottom:12px;background-color:#ecedef;height:100px;min-height:100px">
        <tr>
          <td>
            <center>
              <p>
                Si tienes alguna duda o queja, contáctanos <a href="http://wa.me/51${
                    empresa.telephoneReclamos
                }" target="_blank" ><b>Centro de Ayuda</b></a>.
              </p>
              <p style="color:#9da1a5;font-size:9.3px">
                Le agradecemos tener en cuenta que esta es una comunicación automática de ${
                    empresa.name_empresa
                }<br>
                por tal motivo le pedimos no responder a esta dirección electrónica.
              </p>
            </center>
          </td>
        </tr>
      </tfoot>
    </table>
  </div></body></html>`;
}
