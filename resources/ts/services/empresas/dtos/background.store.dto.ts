import {
    array,
    instance,
    merge,
    object,
    omit,
    type Input,
} from "@vigilio/valibot";
import { backgroundSchema } from "../schemas/background.schema";
import validFileValibot from "~/libs/valibot";

export const backgroundStoreDto = merge([
    omit(backgroundSchema, ["id", "image", "empresa_id"]),
    object({
        image: array(instance(File), [
            validFileValibot({
                required: true,
                min: 1,
                max: 1,
            }),
        ]),
    }),
]);
export type BackgroundStoreDto = Input<typeof backgroundStoreDto>;
