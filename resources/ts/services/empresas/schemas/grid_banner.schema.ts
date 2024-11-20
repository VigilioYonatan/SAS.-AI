import {
    array,
    boolean,
    nullable,
    number,
    object,
    string,
    type Input,
} from "@vigilio/valibot";

export const gridBannerSchema = object({
    id: number(),
    enabled: boolean(),
    responsive: array(
        object({
            width: number(),
            cols: number(),
            rows: nullable(number()),
            gap: number(),
            height: number(),
        })
    ),
    empresa_id: number(),
    title: nullable(string()),
});
export type GridBannerSchema = Input<typeof gridBannerSchema>;
