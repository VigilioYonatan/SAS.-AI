import {
    array,
    boolean,
    minLength,
    minValue,
    nullable,
    number,
    object,
    startsWith,
    string,
    type Input,
} from "@vigilio/valibot";
import { filesSchema } from "~/libs/upload";

export const bannerSchema = object({
    id: number(),
    file: array(filesSchema()),
    title: nullable(string()),
    subtitle: nullable(string()),
    button: nullable(string()),
    enabled: boolean(),
    link: nullable(string([minLength(1), startsWith("http")])),
    order: number(),
    col: number([minValue(1)]),
    row: number([minValue(1)]),
    grid_banner_id: number(),
    empresa_id: number(),
});
export type BannerSchema = Input<typeof bannerSchema>;
