import {
    boolean,
    minLength,
    nullable,
    number,
    objectAsync,
    string,
    type Input,
} from "@vigilio/valibot";
import type { GridBannerSchema } from "./grid_banner.schema";

export const gridBannerAboutSchema = objectAsync({
    id: number(),
    enabled: boolean(),
    empresa_id: number(),
    title: nullable(string([minLength(3)])),
    html: nullable(string([minLength(3)])),
    grid_banner_id: nullable(number()),
});
export type GridBannerAboutSchema = Input<typeof gridBannerAboutSchema>;
export type GridBannerAboutSchemaFromServer = GridBannerAboutSchema & {
    grid_banner: GridBannerSchema;
};
