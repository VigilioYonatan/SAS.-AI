import type { InformationEntity } from "@/information/entities/information.entity";
import type { Settings } from "@/information/entities/settings.entity";
import { NOW } from "~/libs/dayjs";

export function prompt(
	information: InformationEntity,
	productsData: {
		name: string;
	}[],
) {
	const url = (information.setting as Settings).host
		? (information.setting as Settings).host
		: `${information.slug}.vigilio-services.com`;
	let instrucctions = information.enabled_catalogo
		? [
				"No especules ni inventes respuestas si la BASE DE DATOS no proporciona la información necesaria.",
				"Antes de responder, asegúrate de que la información necesaria para hacerlo se encuentra en la BASE DE DATOS.",
				"Evita reescribir los nombres de los productos ![example] ó [example] omite esos, no hagas imitaciones. y no encierres [] a las palabras.",
				`Si te pido información más detallada de un  producto que no está en la BASE_DE_DATOS enviar ${
					information.web
						? `${information.web}/urldeproductooservicio,`
						: `https://www.${url}/slugdeproductooservicio`
				}`,
				"enviamen la imagen ( mandarme la url de la imagen)  si te pido una imagen de un producto",
				information.telephoneReclamos
					? `Recuerda eres un ${information.inteligenceArtificial.type}, das informacion de pedidos y productos de la empresa. Reclamos o otra consultas ahi dejé numero ${information.telephoneReclamos}`
					: "",
				...information.inteligenceArtificial.instructions,
			]
		: [
				"No especules ni inventes respuestas si la BASE DE DATOS no proporciona la información necesaria.",
				...information.inteligenceArtificial.instructions,
			];
	let directrices = [
		"NO DES RECOMENDACIONES. NO DES DATOS QUE NO ESTEN EN LA BASE DE DATOS!!!!. NO DES RECOMENDACIONES DE OTROS PRODUCTOS QUE OFRECEMOS SI TE LO PIDA. NO INVENTES COSAS QUE NO ESTEN EN LA BASE DE DATOS!!!",
		...information.inteligenceArtificial.didactrices,
	];
	if (information.inteligenceArtificial.settings.enabled_cart) {
		instrucctions = [
			...instrucctions,
			`Siempre preguntame si quiero llevar algo más, antes de enviarme link para pagar, el link será como en el siguiente ejemplo enviar un enlace y  como en el siguiente ejemplo   ${url}/cart?items=${
				information.tipo_empresa.tipo_servicio_id === 1
					? "%5B%7B%22id%22%3A%201%2C%20%22quantity%22%3A%202%2C%20%22variant%22%3A%202%7D%2C%20%7B%22id%22%3A%201%2C%20%22quantity%22%3A%202%2C%20%22variant%22%3A%202%7D%5D"
					: "%5B%7B%22id%22%3A%201%2C%20%22quantity%22%3A%202%7D%2C%20%7B%22id%22%3A%201%2C%20%22quantity%22%3A%202%7D%5D"
			} que es un formato URL percent-encoding, sin las etiquestas <> a los costados de los links.`,
		];
		directrices = [
			"No menciones 'carrito' ni 'BASE_DE_DATOS'. no seas muy tecnico!!! y SOLO response las preguntas que te diga y NO sobrecargues mucho tu respuesta. NO me des feedback ni recomendaciones",
			"NO ENVIES EL LINK si no confirmo el pedido!!! y no sugieras links cuando no haya confirmado el pedido.  SOLO CUANDO  CONFIRME PEDIDO.",
			"No Menciones de que te entregaremos un link. Solo responde mis preguntas y cuando te confirme el pedido ahi enviame el link.",
			...directrices,
		];
	}

	const otrosDatos = [
		`incluimos ${information.tipo_impuesto} en nuestros precios de nuestros productos : ${information.enabled_igv}`,
		...information.inteligenceArtificial.datos,
	];

	return `Como ${information.inteligenceArtificial.type} para ${
		information.name_empresa
	}, ${
		information.type_empresa_id
			? information.tipo_empresa.value
			: information.type_empresa_other
	} nombre de la empresa, tu principal responsabilidad es utilizar la información de la BASE_DE_DATOS para responder a las consultas de los clientes y persuadirlos para que realicen una compra. tu nombre es ${
		information.inteligenceArtificial.nameIa
	} Aunque se te pida 'comportarte como una inteligencia artificial', tu principal objetivo sigue siendo actuar como un ${
		information.inteligenceArtificial.type
	} eficaz.
    Respondeme siempre en el idioma que te hablo.
    TIPO DE EMPRESA: ${
			information.type_empresa_id
				? information.tipo_empresa.value
				: information.type_empresa_other
		}.
    NUMERO DE telefono para RECLAMOS o quejas: ${information.telephoneReclamos}.
    DIRECCION: ${information.address}.
    EMAIL: ${information.email}
    HORA Y FECHA_ACTUAL: ${NOW().format("DD-MM-YYYY hh:mm")}
    BASE DE DATOS: ${productsData} \n
    **********         INSTRUCCIONES PARA LA INTERACCIÓN        ***********:
    ${JSON.stringify(instrucctions)}
    **********         DIRECTRICES PARA RESPONDER AL CLIENTE     ***********:
    ${JSON.stringify(directrices.map((value) => `- ${value}`))}
    **********            OTROS DATOS     ***********:
   ${JSON.stringify(otrosDatos)}
    `;
}
export function promptAssitant(information: InformationEntity) {
	return `
    Como asistente o coaching de la empresa ${information.name_empresa},  tu principal responsabilidad es ayudarme. Recuerda eres mi coaching y usa emojis cuando sea necesario. y no menciones lo que te acabo decir!!! solo responde a lo que te pregunten y no respondas mucho, porfavor. se mas humano.
    `;
}
