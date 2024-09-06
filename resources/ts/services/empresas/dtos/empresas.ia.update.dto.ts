import { pick, type Input } from "@vigilio/valibot";
import { empresasSchema } from "../schemas/empresas.schema";

export const empresasIAUpdateDto = pick(empresasSchema, [
    "inteligenceArtificial",
]);

export type EmpresasIAUpdateDto = Input<typeof empresasIAUpdateDto>;
