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

export const gridBannerPageSchema = object({
    id: number(),
    enabled: boolean(),
    empresa_id: number(),
    title: nullable(string([minLength(3)])),
    html: nullable(string([minLength(3)])),
    grid_banner_id: nullable(number()),
    page_id: number(),
});
export type GridBannerPageSchema = Input<typeof gridBannerPageSchema>;
export type GridBannerPageSchemaFromServer = GridBannerPageSchema & {
    grid_banner: GridBannerSchema;
};
