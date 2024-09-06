import type { CSSProperties } from "preact/compat";
import { printFileWithDimension, type FilesSchema } from "~/libs/upload";
export type InformationLogoQualities = 100 | 300;

export function printLogoInformation(
	images: FilesSchema[],
	quality: InformationLogoQualities = 300,
) {
	return printFileWithDimension(images, quality);
}
export type Position =
	| "top-right"
	| "top-left"
	| "bottom-right"
	| "bottom-left";
export const positions: { key: Position; value: string }[] = [
	{
		key: "top-right",
		value: "Arriba - Derecha",
	},
	{
		key: "top-left",
		value: "Arriba - Izquierda",
	},
	{
		key: "bottom-right",
		value: "Abajo - Derecha",
	},
	{
		key: "bottom-left",
		value: "Abajo - Izquierda",
	},
];
export const positionStyle: Record<Position, CSSProperties> = {
	"top-left": { top: "0", left: "0" },
	"top-right": { top: "0", right: "0" },
	"bottom-left": { bottom: "0", left: "0" },
	"bottom-right": { bottom: "0", right: "0" },
};

export const servicios = [
	{
		tipo: "normal",
		empresas: [
			{ id: 1, value: "Repuestos y accesorios" },
			{ id: 2, value: "Revistas y periodicos" },
			{ id: 3, value: "Ropa deportiva" },
			{ id: 4, value: "Ropa mujeres, lenceria, ropa interior" },
			{ id: 5, value: "Ropa para hombres" },
			{ id: 6, value: "Ropa para mujeres, boutiques" },
			{ id: 7, value: "Ropa para ninos y bebes" },
			{ id: 8, value: "Ropa para toda la familia" },
			{ id: 9, value: "Ropa y accesorios de cuero" },
			{ id: 10, value: "Tapiceria" },
			{ id: 11, value: "Telas y pasamaneria" },
			{ id: 12, value: "Telecomunicaciones, Cabinas Internet" },
			{ id: 13, value: "Tiendas de articulos varios" },
			{ id: 14, value: "Tiendas de tecnología" },
			{ id: 15, value: "Tiendas de descuento" },
			{ id: 16, value: "Tiendas por departamentos" },
			{ id: 17, value: "Utiles de oficina" },
			{ id: 18, value: "Ventas puerta a puerta" },
			{ id: 19, value: "Vidrios, pinturas, tapices de pared" },
			{ id: 20, value: "Viveros" },
			{ id: 21, value: "Zapaterias" },
			{ id: 40, value: "Otro" },
		],
	},
	{
		tipo: "restaurantes - bares",
		empresas: [
			{ id: 22, value: "Restaurantes" },
			{ id: 23, value: "Bares" },
			{ id: 41, value: "Otro" },
		],
	},
	{
		tipo: "servicios",
		empresas: [
			{ id: 24, value: "Seguros" },
			{ id: 25, value: "Servicios contables y de auditoria" },
			{ id: 26, value: "Servicios de Carpinteria" },
			{ id: 27, value: "Servicios de jardineria" },
			{ id: 28, value: "Servicios de seguridad" },
			{ id: 29, value: "Servicios funerarios" },
			{ id: 30, value: "Servicios veterinarios" },
			{ id: 31, value: "Taxis, limousines" },
			{ id: 32, value: "Protesis auditiva" },
			{ id: 33, value: "Proveedor fiestas, alimentos preparados" },
			{ id: 34, value: "Quiropracticos" },
			{ id: 35, value: "Refrigeracion, aire acondicionado" },
			{ id: 36, value: "Salon de masajes" },
			{ id: 37, value: "Salones de billar" },
			{ id: 38, value: "Salones de bowling" },
			{ id: 39, value: "Sastreria" },
			{ id: 42, value: "Otro" },
		],
	},
];
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function transferencias(transferencias: any) {
	const data = Object.entries(transferencias).map(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		(body) => Object.values((body as any)[1]).filter((val) => val),
	);

	// aca si  esta vacio entonces que sea null
	return data[0].length || data[1].length || data[2].length
		? transferencias
		: null;
}
