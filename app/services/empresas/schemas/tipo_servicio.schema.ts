import { number, objectAsync, string, type Input } from "@vigilio/valibot";

export const tipoServicioSchema = objectAsync({
	id: number(),
	tipo: string(),
});

export type TipoServicioSchema = Input<typeof tipoServicioSchema>;
