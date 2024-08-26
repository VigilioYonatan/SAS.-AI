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
