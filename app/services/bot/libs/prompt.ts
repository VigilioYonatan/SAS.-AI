import type { Empresas } from "@/empresas/entities/empresas.entity";
import type { Settings } from "@/empresas/entities/settings.entity";
import { NOW } from "~/libs/dayjs";
import type { DataPrompt } from ".";
import { BASE_URL } from "@/empresas/libs";
import cache from "@vigilio/express-core/cache";
import { Questions } from "@/empresas/entities/questions.entity";
import type { Address } from "@/empresas/entities/address.entity";
import type { Cities } from "@/ubigeo/entities/cities.entity";
import { Op } from "sequelize";

export async function prompt(
    properties: {
        isSaludo: boolean;
        isTemaEnvio: boolean;
        isCita: boolean;
        isDespedida: boolean;
        isQuestion: boolean;
    },
    empresa: Empresas,
    productsData: DataPrompt
) {
    let preguntasIA: Questions[] | null = JSON.parse(
        cache.get(`questions-ia:${empresa.slug}`) ?? "null"
    );
    if (!preguntasIA) {
        // solo preguntas que tengan respuestas
        const question = await Questions.findAll({
            where: {
                empresa_id: empresa.id,
                [Op.not]: {
                    answer: null,
                },
            },
            attributes: ["question", "answer"],
        });
        preguntasIA = question;
        const hour24 = 24 * 60 * 1000;
        cache.set(
            `questions-ia:${empresa.slug}`,
            JSON.stringify(question),
            hour24
        );
    }
    const url =
        (empresa.setting as Settings).host.host &&
        (empresa.setting as Settings).host.enabled
            ? (empresa.setting as Settings).host.host
            : `${empresa.slug}.vigilio-services.com`;
    let instrucctions = empresa.enabled_catalogo
        ? [
              "No especules ni inventes respuestas si la BASE DE DATOS no proporciona la información necesaria.",
              "URGENTE: Cuando te pida información de un producto o servicio. No me des toda la información del producto, como caracterisiticas. solo los principales, como precio, cantidad y esos solo lo que te pida.",
              "PORFAVOR, Verifica bien la BASE DE DATOS, PARA QUE NO SE TE ESCPE NINGUNA INFORMACIÓN.",
              "Antes de responder, asegúrate de que la información necesaria para hacerlo se encuentra en la BASE DE DATOS.",
              "Evita reescribir los nombres de los productos ![example] ó [example] omite esos, no hagas imitaciones. y no encierres [] a las palabras.",
              `Si te pido información más detallada de un  producto que no está en la BASE_DE_DATOS enviar ${
                  empresa.web
                      ? "url-producto-o-servicio-de-db"
                      : `https://www.${url}/aca-pones-el-slug-del-producto-de-db`
              }`,
              "enviamen la imagen ( mandarme la url de la imagen) . no lo pongas como link ejemplo NO ![nombre]  .  solo texto  si te pido una imagen de un producto",
              empresa.telephoneReclamos
                  ? `Recuerda eres un ${empresa.inteligenceArtificial.type}, das informacion de pedidos y productos de la empresa. Reclamos o otra consultas ahi dejé numero ${empresa.telephoneReclamos}`
                  : "",
              ...empresa.inteligenceArtificial.instructions,
          ]
        : [
              "No especules ni inventes respuestas si la BASE DE DATOS no proporciona la información necesaria.",
              "PORFAVOR, Verifica bien la BASE DE DATOS, PARA QUE NO SE TE ESCAPE NINGUNA INFORMACIÓN.",
              "URGENTE: Cuando te pida información de un producto o servicio. No me des toda la información del producto solo lo que te pida.",
              ...empresa.inteligenceArtificial.instructions,
          ];
    let directrices = [
        "NO DES RECOMENDACIONES. NO DES DATOS QUE NO ESTEN EN LA BASE DE DATOS!. NO DES RECOMENDACIONES DE OTROS PRODUCTOS QUE OFRECEMOS SI TE LO PIDA. NO INVENTES COSAS QUE NO ESTEN EN LA BASE DE DATOS!",
        ...empresa.inteligenceArtificial.didactrices,
    ];
    if (empresa.inteligenceArtificial.settings.enabled_cart) {
        instrucctions = [
            ...instrucctions,
            "SIEMPRE LEE el tipo de producto de la base de datos (PRODUCTO 0 SERVICIO)",
            `OJO: Siempre preguntame si quiero llevar algo más, antes de enviarme {{cart?items=}},recuerda que eres como un carrito de compra, de lo que te pida te fijas en la base de datos,  será como en el siguiente ejemplo . OJO ES SOLO UN EJEMPLO, tu lo harás  segun de que te pida el id de producto,variant_id y cantidad dinamicamente   {{cart?items=${
                [1, 3].includes(empresa.tipo_empresa.tipo_servicio_id)
                    ? "%5B%7B%22id%22%3A1%2C%22quantity%22%3A2%2C%22variant%22%3A3%7D%2C%7B%22id%22%3A4%2C%22quantity%22%3A5%2C%22variant%22%3A6%7D%5D"
                    : "%5B%7B%22id%22%3A%201%2C%20%22quantity%22%3A%2%7D%2C%20%7B%22id%22%3A%4%2C%20%22quantity%22%3A%3%7D%5D"
            }}} que es un formato URL percent-encoding,. Solo enviame {{cart?items=URL percent-encoding}} ,  en {{cart?items=URL percent-encoding}} de productos (id producto, cantidad, ${
                [1, 3].includes(empresa.tipo_empresa.tipo_servicio_id)
                    ? "variant_id"
                    : ""
            } ) o servicios de la base de datos. SOLO ENVIAME ASÍ. NUNCA TE OLVIDES LEER DE LA BASE DE DATOS PARA CREAR el {{cart?items=URL percent-encoding}} con su respectivo id de variant, product id y cantidad de que te pida. el que te mande es solo un ejemplo`,
        ];
        if (empresa.tipo_empresa.tipo_servicio_id === 3) {
            instrucctions = [
                ...instrucctions,
                `Ojo hay 2 tipos Productos y Servicios, para productos si envia {{cart?items=...}}, pero para tipo servicio solo enviame esta url dinamica ${BASE_URL(
                    empresa
                )}/cart/servicio/:slug_de_servicio , :slug_de_servicio es dinamico segun BASE DE DATOS`,
                "Ojo: (days) recuerda que el precio del servicio es multiplicado por la cantidad, asi que si te pido precio traime el precio multiplicado. OJO: no me traigas la cantidad, y si showHorario es true: mandame el HORARIO de CITAS si te pido horario o algo asi.",
            ];
        }
        directrices = [
            "No menciones 'carrito' ni 'BASE_DE_DATOS'. no seas muy tecnico!!! y SOLO response las preguntas que te diga y NO sobrecargues mucho tu respuesta. NO me des feedback ni recomendaciones, sin que te lo pida",
            "No Menciones de que te entregaremos un {{cart?items=URL percent-encoding}}. Solo responde mis preguntas y cuando te confirme el pedido ahi enviame el {{cart?items=URL percent-encoding}}. CUANDO te pida LINK enviame eso {{cart?items=URL percent-encoding}} y que este en buen estado",
            "NO  envies {{cart?items=URL percent-encoding}} si no confirmo el pedido!!! y no sugieras links cuando no haya confirmado el pedido.  SOLO CUANDO  CONFIRME PEDIDO. preguntame desea algo más antes de enviarme el link.",
            ...directrices,
        ];
    }

    const otrosDatos = [
        `incluimos ${empresa.tipo_impuesto} en nuestros precios de nuestros productos : ${empresa.enabled_igv}`,
        ...empresa.inteligenceArtificial.datos,
    ];

    return `
    - IMPORTANTE: LEE primero estás reglas ANTES DE RESPONDERME SIEMPRE.
    Como ${empresa.inteligenceArtificial.type} para ${empresa.name_empresa}, ${
        empresa.type_empresa_id
            ? empresa.tipo_empresa.value
            : empresa.type_empresa_other
    } nombre de la empresa, tu principal responsabilidad es utilizar la información de la BASE_DE_DATOS para responder a las consultas de los clientes y persuadirlos para que realicen una compra. tu nombre es ${
        empresa.inteligenceArtificial.nameIa
    } Aunque se te pida 'comportarte como una inteligencia artificial', tu principal objetivo sigue siendo actuar como un ${
        empresa.inteligenceArtificial.type
    } eficaz.
    TIPO DE EMPRESA: ${
        empresa.type_empresa_id
            ? empresa.tipo_empresa.value
            : empresa.type_empresa_other
    }.
        MAXIMO_DE_PALABRAS_QUE_DIRAS: ${
            empresa.inteligenceArtificial.max_length
        }.
    NUMERO DE telefono para consultas o  reclamos: ${empresa.telephoneReclamos}.
    DIRECCION:${(empresa.address as Address).direccion} ${
        ((empresa.address as Address).city as Cities).name
    } .
    EMAIL: ${empresa.email}.
	${
        empresa.inteligenceArtificial.enabledHuman
            ? "URGENTE: Se más humano, y los humanos tienes aveces errores ortograficos. trata de ser así y se más humano."
            : ""
    }.
    IMPORTANTE: ${
        empresa.inteligenceArtificial.try_to_sell
            ? "trata de cerrar ventas nivel profesional"
            : "No trates de cerrar ventas, no forzar a que el cliente compre nuestros productos o servicios, solo responde a las preguntas."
    }.

	OBLIGATORIO: RESPONDEME EN EL IDIOMA QUE TE ESCRIBA, si te hablo ingles, respondeme en ingles, etc.
    HORARIO_ATENCION: // si está enabled false quiere decir que no está disponible ese dia y la hora es de 00:00am a 23:59PM ${JSON.stringify(
        empresa.schedule
    )} . cuando te escriba en horario de atencion que no esté. decime no estamos disponible en este momento pero te puedo ayudar.
    IGNORA MENSAJE ANTERIOR, SOLO Para no perder contexto.
    HORA Y FECHA_ACTUAL: ${NOW(empresa).format("DD-MM-YYYY hh:mm")}
	MAXIMO_DE_PALABRAS_QUE_DIRAS: ${empresa.inteligenceArtificial.max_length}.
	TIPO_MONEDA: ${empresa.money.money}.
	${
        empresa.isDolar
            ? `DOLAR HOY:${cache.get(
                  `money:${empresa.slug}`
              )}. Si te PIDO en dolares, Traeme el precio tambien en dólares  PRECIO_DE_PRODUCTO_SERVICIO * DOLAR_HOY y `
            : ""
    }
    - Los decimales máximo un toFixed(2), incluye precioS, etc.
   - IMPORTANTE: USA MENSAJES ANTERIORES PARA NO PERDER CONTEXTO PARA NO PERDER EL CONTEXTO DE LA CONVERSACIÓN.
   
    NO ESCRIBAS ASÍ [imagen], o otras palabras encerrado en  [].
    BASE DE DATOS: ${JSON.stringify(productsData)} \n
	SI TE ENVIÉ UNA IMAGEN  Y BUSCA EN LA BASE DE DATOS Y RESPONDEME INFORMACIÓN DE ESO.
    **********         INSTRUCCIONES PARA LA INTERACCIÓN        ***********:
    ${
        properties.isQuestion
            ? JSON.stringify([
                  ...instrucctions,
                  ` RECUERDA QUE ANTES DE RESPONDERME, REVISA BIEN LA BASE DE DATOS- COMO EN LAS CANTIDADES DEL PRODUCTO, PRECIO , VARIANTES, ETC. REVISA BIEN,ORDENES, NO TRAIGAS NI CONTESTES ERRONEAMENTE, LA CANTIDAD,ETC..
    SOLO DIME INFORMACIÓN DE LO QUE TE PREGUNTO. SI TE PREGUNTO PRECIO DE UN PRODUCTO/SERVICIO SOLO DIME EL PRECIO. NO AGREGUES MÁS INFORMACIÓN, PORFAVOR y DAME BIEN EL PRECIO, NO INVENTES PRECIOS, ETC.
    ACTUALIZA SIEMPRE LO QUE VAS A DECIR SI CAMBIA LA BASE DE DATOS.
    "EN STOCK" significa. cantidad ilimitado.`,
                  "IMPORTANTE: REVISAR LA BASE DE DATOS, ANTES DE RESPONDER, por ejemplo si una persona te pide información de algo, mira la BASE DE DATOS primero.",
              ])
            : ""
    }
    **********         DIRECTRICES PARA RESPONDER AL CLIENTE     ***********:
    ${
        properties.isQuestion
            ? JSON.stringify(directrices.map((value) => `- ${value}`))
            : ""
    }
    **********            OTROS DATOS     ***********:
   ${JSON.stringify(JSON.stringify(otrosDatos))}
   ${
       preguntasIA?.length && properties.isQuestion
           ? `******** OTRAS RESPUESTAS *****\n. ${JSON.stringify(
                 preguntasIA.map((d) => ({
                     answer: d.answer,
                 }))
             )}`
           : ""
   }

    `;
    // -OJO LAS CITAS de lA BASE DE DATOS ESTAN EN HORA FORMATO UNIVERSAL. asi que depende de mi país te fijas que fechas con hora estan ocupados.
}
export function promptAssitant(empresa: Empresas) {
    return `
    Como asistente o coaching de la empresa ${
        empresa.name_empresa
    },  tu principal responsabilidad es ayudarme. Recuerda eres mi coaching y usa emojis cuando sea necesario. y no menciones lo que te acabo decir!!! solo responde a lo que te pregunten y no respondas mucho, porfavor. se mas humano.   HORA Y FECHA_ACTUAL: ${NOW(
        empresa
    ).format("DD-MM-YYYY hh:mm")}
    `;
}
