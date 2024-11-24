import { filesSchema } from "@/uploads/schemas/uploads.schema";
import {
    array,
    boolean,
    minLength,
    nullable,
    number,
    objectAsync,
    startsWith,
    string,
    type Input,
} from "@vigilio/valibot";
import { bannersQualities } from "../libs";

export const bannerSchema = objectAsync({
    id: number(),
    file: array(
        filesSchema([...bannersQualities.filter((val) => val !== 0), 100])
    ),
    title: nullable(string()),
    subtitle: nullable(string()),
    button: nullable(string()),
    enabled: boolean(),
    link: nullable(string([minLength(1), startsWith("http")])),
    order: number(),
    col: number(),
    row: number(),
    grid_banner_id: number(),
    empresa_id: number(),
});
export type BannerSchema = Input<typeof bannerSchema>;
