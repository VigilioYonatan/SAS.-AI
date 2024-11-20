import {
    array,
    boolean,
    nullable,
    number,
    object,
    objectAsync,
    string,
    type Input,
} from "@vigilio/valibot";

export const gridBannerSchema = objectAsync({
    id: number(),
    enabled: boolean(),
    responsive: array(
        object({
            width: number(),
            cols: number(),
            rows: nullable(number()),
            height: number(),
            gap: number(),
        })
    ),
    empresa_id: number(),
    title: nullable(string()),
});
export type GridBannerSchema = Input<typeof gridBannerSchema>;
