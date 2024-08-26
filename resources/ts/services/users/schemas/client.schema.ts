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
    startsWith,
    toTrimmed,
} from "@vigilio/valibot";

export const clientsSchema = objectAsync({
    id: number(),
    fullname: nullable(string([toTrimmed(), minLength(3), maxLength(60)])),
    telephone: string([
        toTrimmed(),
        minLength(9),
        maxLength(9),
        custom((value) => /^[0-9]+$/.test(value), "Numero de celular válido."),
        startsWith("9"),
    ]),
    enabled: boolean(),
    information_id: number(),
});

export type ClientsSchema = Input<typeof clientsSchema> & {
    updatedAt?: Date;
    createdAt?: Date;
};
export type ClientsSchemaFromServer = ClientsSchema & {
    updatedAt?: Date;
    createdAt?: Date;
};
