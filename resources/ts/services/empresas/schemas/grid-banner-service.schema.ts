import {
    array,
    boolean,
    nullable,
    number,
    object,
    string,
    type Input,
} from "@vigilio/valibot";
import { GridBannerSchema } from "./grid_banner.schema";
import { BannerSchema } from "./banner.schema";

export const gridBannerServicechema = object({
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
export type GridBannerServicechemaFromServer = GridBannerServicechema & {
    grid_banner: GridBannerSchema & { banners: BannerSchema[] };
    banners: BannerSchema[];
};
