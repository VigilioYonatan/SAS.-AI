import { CitiesSchemaFromServer } from "@/ubigeo/schemas/cities.schema";
import {
    minLength,
    number,
    objectAsync,
    string,
    toTrimmed,
    type Input,
} from "@vigilio/valibot";

export const addressSchema = objectAsync({
    id: number(),
    city_id: number(),
    urbanizacion: string([toTrimmed(), minLength(1)]),
    direccion: string([toTrimmed(), minLength(1)]),
    codLocal: string([toTrimmed()]),
    empresa_id: number(),
});
export type AddressSchema = Input<typeof addressSchema>;
export type AddressSchemaFromServer = AddressSchema & {
    city: CitiesSchemaFromServer;
};
