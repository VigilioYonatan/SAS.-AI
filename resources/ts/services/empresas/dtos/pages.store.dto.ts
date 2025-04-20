import {
    array,
    instance,
    merge,
    nullable,
    object,
    omit,
    type Input,
} from "@vigilio/valibot";
import { pagesSchema } from "../schemas/pages.schema";
import validFileValibot from "~/libs/valibot";

export const pagesStoreDto = merge([
    omit(pagesSchema, ["id", "isDinamic", "favicon", "ogg_favicon"]),
    object({
        favicon: nullable(
            array(instance(File), [
                validFileValibot({
                    required: false,
                    min: 1,
                    max: 1,
                    types: [
                        "image/jpg",
                        "image/webp",
                        "image/jpeg",
                        "image/gif",
                        "image/png",
                    ],
                }),
            ])
        ),
        ogg_favicon: nullable(
            array(instance(File), [
                validFileValibot({
                    required: false,
                    min: 1,
                    max: 1,
                    types: [
                        "image/jpg",
                        "image/webp",
                        "image/jpeg",
                        "image/gif",
                        "image/png",
                    ],
                }),
            ])
        ),
    }),
]);
export type PagesStoreDto = Input<typeof pagesStoreDto>;
