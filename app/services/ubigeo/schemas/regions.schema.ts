import { boolean, number, object, string, type Input } from "@vigilio/valibot";

export const regionsSchema = object({
    id: string(),
    code: string(),
    name: string(),
    priceShipping: number(),
    enabled: boolean(),
    days: number(),
    country_id: number(),
});

export type RegionsSchema = Input<typeof regionsSchema>;
