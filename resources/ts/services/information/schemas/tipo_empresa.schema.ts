import { number, objectAsync, string, type Input } from "@vigilio/valibot";
import type { TipoServicioSchema } from "./tipo_servicio.schema";

export const tipoEmpresaSchema = objectAsync({
    id: number(),
    value: string(),
    tipo_servicio_id: number(),
});

export type TipoEmpresaSchema = Input<typeof tipoEmpresaSchema>;
export type TipoEmpresaSchemaFromServer = Input<typeof tipoEmpresaSchema> & {
    tipo_empresa: TipoServicioSchema;
};
