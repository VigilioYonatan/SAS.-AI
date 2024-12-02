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
    file: nullable(
        array(
            filesSchema([...bannersQualities.filter((val) => val !== 0), 100])
        )
    ),
    title: nullable(string()),
    subtitle: nullable(string()),
    button: nullable(string()),
    enabled: boolean(),
    link: nullable(string([minLength(1), startsWith("http")])),
    order: number(),
    col: number(),
    row: number(),
    grid_banner_id: nullable(number()),
    grid_banner_service_id: nullable(number()),
    script: nullable(string()),
    empresa_id: number(),
});
export type BannerSchema = Input<typeof bannerSchema>;
