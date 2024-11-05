import {
    type Input,
    number,
    minLength,
    objectAsync,
    maxLength,
    string,
    boolean,
    custom,
    nullable,
    toTrimmed,
    object,
    email,
    date,
    coerce,
    array,
} from "@vigilio/valibot";

export const clientsSchema = objectAsync({
    id: number(),
    fullname: nullable(string([toTrimmed(), minLength(3), maxLength(60)])),
    telephone: string([
        toTrimmed(),
        minLength(6),
        custom(
            (value) => /^\d+$/.test(value),
            "Este campo solo permite números."
        ),
    ]),
    email: nullable(string([email()])),
    address: nullable(string([minLength(10), maxLength(100)])),
    reference: nullable(string([minLength(10), maxLength(100)])),
    city_id: nullable(number()),
    map_marker: nullable(
        object({ lng: number(), lat: number() }, "Coordenadas no válida.")
    ),
    enabled: boolean(),
    identification_number: nullable(string("Documento de identidad no válido")),
    empresa_id: number(),
    buys: nullable(
        array(
            object({
                title: string(),
                date: nullable(coerce(date(), (val) => new Date(val as Date))),
                order: string(),
            })
        )
    ),
});

export type ClientSchema = Input<typeof clientsSchema> & {
    updatedAt?: Date;
    createdAt?: Date;
};
