import { number, object, string, type Input } from "@vigilio/valibot";

export const countriesSchema = object({
    id: number(),
    code: string(),
    name: string(),
});
export type CountriesSchema = Input<typeof countriesSchema>;
