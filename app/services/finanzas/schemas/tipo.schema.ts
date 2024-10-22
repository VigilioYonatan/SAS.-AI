import { number, objectAsync, startsWith, string } from "@vigilio/valibot";
import type { Input } from "valibot";

export const tipoFinanzasSchema = objectAsync({
	id: number(),
	name: string(),
	empresa_id: number(),
});
export type TipoFinanzasSchema = Input<typeof tipoFinanzasSchema>;

export const categoryFinanzasSchema = objectAsync({
	id: number(),
	value: string(),
	tipo_finanza_id: number(),
	icon: string([startsWith("<i class=", "Icono no válido")]),
	empresa_id: number(),
});
export type CategoryFinanzasSchema = Input<typeof categoryFinanzasSchema>;
