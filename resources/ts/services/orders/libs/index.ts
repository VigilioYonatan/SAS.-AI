import { verifyBank } from "@/cart/views/Niubiz";
import useInformationstore from "@/information/stores/information.store";
import {
	bbvaImage,
	bcpImage,
	interbankImage,
	paypalICOImage,
	plinImage,
	yapeImage,
} from "~/config/settings";

export function colorByOrdersId(id: number) {
	const icons: Record<number, string> = {
		1: "bg-yellow-600",
		2: "bg-blue-600",
		3: "bg-orange-600",
		4: "bg-black",
		5: "bg-gray-600",
		6: "bg-success",
		7: "bg-danger",
	};
	return icons[id];
}

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

export const isValidDni = new RegExp(/^\d{8}$/);
export const isValidRUC = new RegExp(/^(10|20)\d{9}$/);
export const isValidPassport = new RegExp(/^[A-Z]{1}\d{8}$/);
export const isValidCarnetExtranjeria = new RegExp(/^[A-Z]{1}\d{9}$/);

export const isValidPhoneNumber = new RegExp(/^9\d{0,8}$/);
export const visaRegex = new RegExp(/^4\d{15}$/);
export const mastercardRegex = new RegExp(/^5[1-5]\d{14}$/);

export function payMethodIcon(): Record<number, string> {
	const information = useInformationstore();
	return {
		1: "<span class='flex  gap-1 items-center'><i class='fas fa-money-bill-wave' class='mr-1'></i> efectivo</span>",
		2: `<span class='flex  gap-1 items-center'><i class='fas fa-credit-car' class='mr-1'></i>${
			information.state!.pasarela === "izipay"
				? "tarjeta de credito o yape"
				: "Tarjeta de credito"
		} </span>`,
		3: `<div class='flex gap-1 items-center '>
		<img src='${yapeImage()}' width='30' height='30' /><img src='${plinImage()}' width='30' height='30' /></div>`,
		4: `<div class='flex gap-1 items-center '><img src='${paypalICOImage()}' width='30' height='30' /></div>`,
		5: `<div class='flex flex-col justify-center items-center'>
    <span>Transferiencia B.</span>
    <div>${
			information.state!.transferencias?.bcp &&
			verifyBank(information.state!.transferencias.bcp)
				? `<img src='${bcpImage()}' width='30' height='30' />
    </div>`
				: ""
		}${
			information.state!.transferencias?.bbva &&
			verifyBank(information.state!.transferencias.bbva)
				? `<img src='${bbvaImage()}' width='30' height='30' />
    </div>`
				: ""
		}${
			information.state!.transferencias?.interbank &&
			verifyBank(information.state!.transferencias.interbank)
				? `<img src='${interbankImage()}' width='30' height='30' />
    </div>`
				: ""
		}
     </div>`,
		6: "<span>Otro</span>",
	};
}
export const MOTIVOTRASLADO = [
	{ key: "01", value: "VENTA" },
	{
		key: "14",
		value: "VENTA SUJETA A CONFIRMACIÓN DEL COMPRADOR",
	},
	{ key: "02", value: "COMPRA" },
	{
		key: "04",
		value: "TRASLADO ENTRE ESTABLECIMIENTOS DE LA MISMA EMPESA",
	},
	{
		key: "18",
		value: "TRASLADO EMISOR ITINERANTE CP",
	},
	{ key: "08", value: "IMPORTACIÓN" },
	{ key: "09", value: "EXPORTACIÓN" },
	{ key: "19", value: "TRASLADO A ZONA PRIMARIA" },
	{ key: "13", value: "OTROS" },
];
export const MODALIDADTRASLADO = [{ key: "01", value: "TRANSPORTE PUBLICO" }];
export const UNIDADMEDIDAD = [
	{ key: "4A", value: "BOBINAS" },
	{ key: "BJ", value: "BALDE" },
	{ key: "BLL", value: "BARRILES" },
	{ key: "BG", value: "BOLSA" },
	{ key: "BO", value: "BOTELLAS" },
	{ key: "BX", value: "CAJA" },
	{ key: "CT", value: "CARTONES" },
	{ key: "CMK", value: "CENTIMETRO CUADRADO" },
	{ key: "CMQ", value: "CENTIMETRO CUBICO" },
	{ key: "CMT", value: "CENTIMETRO LINEAL" },
	{ key: "CEN", value: "CIENTO DE UNIDADES" },
	{ key: "CY", value: "CILINDRO" },
	{ key: "CJ", value: "CONOS" },
	{ key: "DZN", value: "DOCENA" },
	{ key: "DZP", value: "DOCENA POR 10**6" },
	{ key: "BE", value: "FARDO" },
	{ key: "GLI", value: "GALON INGLES (4,545956L)" },
	{ key: "GRM", value: "GRAMO" },
	{ key: "GRO", value: "GRUESA" },
	{ key: "HLT", value: "HECTOLITRO" },
	{ key: "LEF", value: "HOJA" },
	{ key: "SET", value: "JUEGO" },
	{ key: "KGM", value: "KILOGRAMO" },
	{ key: "KTM", value: "KILOMETRO" },
	{ key: "KWH", value: "KILOVATIO HORA" },
	{ key: "KT", value: "KIT" },
	{ key: "CA", value: "LATAS" },
	{ key: "LBR", value: "LIBRAS" },
	{ key: "LTR", value: "LITRO" },
	{ key: "MWH", value: "MEGAWATT HORA" },
	{ key: "MTR", value: "METRO" },
	{ key: "MTK", value: "METRO CUADRADO" },
	{ key: "MTQ", value: "METRO CUBICO" },
	{ key: "MGM", value: "MILIGRAMOS" },
	{ key: "MLT", value: "MILILITRO" },
	{ key: "MMT", value: "MILIMETRO" },
	{ key: "MMK", value: "MILIMETRO CUADRADO" },
	{ key: "MMQ", value: "MILIMETRO CUBICO" },
	{ key: "MIL", value: "MILLARES" },
	{ key: "UM", value: "MILLON DE UNIDADES" },
	{ key: "ONZ", value: "ONZAS" },
	{ key: "PF", value: "PALETAS" },
	{ key: "PK", value: "PAQUETE" },
	{ key: "PR", value: "PAR" },
	{ key: "FOT", value: "PIES" },
	{ key: "FTK", value: "PIES CUADRADOS" },
	{ key: "FTQ", value: "PIES CUBICOS" },
	{ key: "C62", value: "PIEZAS" },
	{ key: "PG", value: "PLACAS" },
	{ key: "ST", value: "PLIEGO" },
	{ key: "INH", value: "PULGADAS" },
	{ key: "RM", value: "RESMA" },
	{ key: "DR", value: "TAMBOR" },
	{ key: "STN", value: "TONELADA CORTA" },
	{ key: "LTN", value: "TONELADA LARGA" },
	{ key: "TNE", value: "TONELADAS" },
	{ key: "TU", value: "TUBOS" },
	{ key: "NIU", value: "UNIDAD (BIENES)" },
	{ key: "ZZ", value: "UNIDAD (SERVICIOS)" },
	{ key: "GLL", value: "US GALON (3,7843 L)" },
	{ key: "YRD", value: "YARDA" },
	{ key: "YDK", value: "YARDA CUADRADA" },
];
