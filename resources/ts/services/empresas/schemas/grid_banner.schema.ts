import {
    boolean,
    minLength,
    nullable,
    number,
    object,
    string,
    type Input,
} from "@vigilio/valibot";

export const gridBannerSchema = object({
    id: number(),
    enabled: boolean(),
    title: nullable(string([minLength(3)])),
    html: nullable(string([minLength(3)])),
    empresa_id: number(),
});
export type GridBannerSchema = Input<typeof gridBannerSchema>;
