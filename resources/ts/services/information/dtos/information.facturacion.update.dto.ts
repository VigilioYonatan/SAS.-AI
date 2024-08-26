import {
    type Input,
    object,
    array,
    instance,
    nullable,
} from "@vigilio/valibot";
import { companySchema } from "../schemas/information.schema";
import validFileValibot from "~/libs/valibot";

export const informationFacturacionUpdateDto = companySchema;
export const informationFacturacionCertificadoUpdateDto = object({
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

export type InformationFacturacionUpdateDto = Input<
    typeof informationFacturacionUpdateDto
>;
export type InformationFacturacionCertificadoUpdateDto = Input<
    typeof informationFacturacionCertificadoUpdateDto
>;
