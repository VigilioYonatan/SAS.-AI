import { filesSchema } from "@/uploads/schemas/uploads.schema";
import {
    type Input,
    number,
    objectAsync,
    string,
    nullable,
    array,
    regex,
    toTrimmed,
    minLength,
    maxLength,
    custom,
    email,
} from "@vigilio/valibot";
import { suppliersLogoQualities } from "../libs";

export const suppliersSchema = objectAsync({
    id: number(),
    supplier_code: string(),
    ruc: string([toTrimmed(), regex(/^(10|20)\d{9}$/, "Ruc no válido")]),
    razon_social: string([toTrimmed(), minLength(5), maxLength(255)]),
    activity: string([toTrimmed(), minLength(5), maxLength(100)]),
    address: string([toTrimmed(), minLength(5), maxLength(100)]),
    contact: nullable(string([toTrimmed(), minLength(5), maxLength(19)])),
    phone_one: string([
        toTrimmed(),
        minLength(9),
        maxLength(20),
        custom(
            (value) => /^[0-9]+$/.test(value),
            "Numero de celular no válido."
        ),
    ]),
    phone_two: nullable(
        string([
            toTrimmed(),
            minLength(9),
            maxLength(20),
            custom(
                (value) => /^[0-9]+$/.test(value),
                "Numero de celular no válido"
            ),
        ])
    ),
    email: string([email()]),
    email2: nullable(string([email()])),
    web: nullable(
        string([
            regex(
                /^(https?:\/\/)?[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}(\/\S*)?$/,
                "Web no válida"
            ),
        ])
    ),
    logo: nullable(array(filesSchema(suppliersLogoQualities))),
    information_id: number(),
});

export type SuppliersSchema = Input<typeof suppliersSchema> & {
    createdAt?: Date;
    updatedAt?: Date;
};
export type SuppliersSchemaFromServer = SuppliersSchema;
