import { pickAsync, type Input } from "@vigilio/valibot";
import { empresasSchema } from "../schemas/empresas.schema";

export const empresasIAUpdateDto = pickAsync(empresasSchema, [
    "inteligenceArtificial",
]);
export type EmpresasIAUpdateDto = Input<typeof empresasIAUpdateDto>;
