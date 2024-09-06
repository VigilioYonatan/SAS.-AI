import {
    type Input,
    object,
    array,
    instance,
    nullable,
} from "@vigilio/valibot";
import { companySchema } from "../schemas/empresas.schema";
import validFileValibot from "~/libs/valibot";

export const empresasFacturacionUpdateDto = companySchema;
export const empresasFacturacionCertificadoUpdateDto = object({
    certificado: nullable(
        array(instance(File), "Este campo es obligatorio.", [
            validFileValibot({
                required: true,
                min: 1,
                max: 1,
                types: null, //.txt
            }),
        ])
    ),
});

export type EmpresasFacturacionUpdateDto = Input<
    typeof empresasFacturacionUpdateDto
>;
export type EmpresasFacturacionCertificadoUpdateDto = Input<
    typeof empresasFacturacionCertificadoUpdateDto
>;
