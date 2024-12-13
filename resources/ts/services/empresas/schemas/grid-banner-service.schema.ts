import {
    boolean,
    minLength,
    nullable,
    number,
    object,
    string,
    type Input,
} from "@vigilio/valibot";
import { GridBannerSchema } from "./grid_banner.schema";

export const gridBannerServicechema = object({
    id: number(),
    enabled: boolean(),
    empresa_id: number(),
    title: nullable(string([minLength(3)])),
    html: nullable(string([minLength(3)])),
    grid_banner_id: nullable(number()),
});
export type GridBannerServicechema = Input<typeof gridBannerServicechema>;
export type GridBannerServicechemaFromServer = GridBannerServicechema & {
    grid_banner: GridBannerSchema;
};
