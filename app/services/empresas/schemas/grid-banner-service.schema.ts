import {
    boolean,
    nullable,
    number,
    objectAsync,
    string,
    type Input,
} from "@vigilio/valibot";

export const gridBannerServicechema = objectAsync({
    id: number(),
    title: nullable(string()),
    enabled: boolean(),
    html: nullable(string()),
    empresa_id: number(),
    grid_banner_id: nullable(number()),
});
export type GridBannerServicechema = Input<typeof gridBannerServicechema>;
