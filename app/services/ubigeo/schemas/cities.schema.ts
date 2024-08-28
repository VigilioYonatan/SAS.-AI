import { number, object, string, type Input } from "@vigilio/valibot";
import type { RegionsSchema } from "./regions.schema";

export const citiesSchema = object({
    id: string(),
    code: string(),
    name: string(),
    region_id: number(),
});
export type CitiesSchema = Input<typeof citiesSchema>;
export type CitiesSchemaFromServer = CitiesSchema & { region: RegionsSchema };
