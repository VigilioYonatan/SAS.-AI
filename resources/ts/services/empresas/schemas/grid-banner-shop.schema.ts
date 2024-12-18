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

export const gridBannerShopSchema = object({
    id: number(),
    enabled: boolean(),
    empresa_id: number(),
    title: nullable(string([minLength(3)])),
    html: nullable(string([minLength(3)])),
    grid_banner_id: nullable(number()),
});
export type GridBannerShopSchema = Input<typeof gridBannerShopSchema>;
export type GridBannerShopSchemaFromServer = GridBannerShopSchema & {
    grid_banner: GridBannerSchema;
};
