import {
    boolean,
    nullable,
    number,
    objectAsync,
    string,
    type Input,
} from "@vigilio/valibot";

export const gridBannerSchema = objectAsync({
    id: number(),
    enabled: boolean(),
    title: nullable(string()),
    html: nullable(string()),
    empresa_id: number(),
});
export type GridBannerSchema = Input<typeof gridBannerSchema>;
