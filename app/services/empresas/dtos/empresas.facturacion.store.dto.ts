import { type Input } from "@vigilio/valibot";
import { companySchema } from "../schemas/empresas.schema";

export const empresasFacturacionUpdateDto = companySchema;

export type EmpresasFacturacionUpdateDto = Input<
	typeof empresasFacturacionUpdateDto
>;
