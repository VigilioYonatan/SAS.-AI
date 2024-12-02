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

export const gridBannerServicechema = objectAsync({
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
    grid_banner_id: nullable(number()),
});
export type GridBannerServicechema = Input<typeof gridBannerServicechema>;
