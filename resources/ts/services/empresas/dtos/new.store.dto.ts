import {
    array,
    instance,
    merge,
    nullable,
    object,
    omit,
    pick,
    type Input,
} from "@vigilio/valibot";
import { newSchema } from "../schemas/new.schema";
import validFileValibot from "~/libs/valibot";

export const newStoreDto = merge([
    omit(newSchema, ["id", "empresa_id"]),
    object({
        image: nullable(
            array(instance(File), [
                validFileValibot({
                    required: false,
                    min: 1,
                    max: 1,
                }),
            ])
        ),
    }),
]);
export const newUpdateImageDto = pick(newStoreDto, ["image"]);
export type NewUpdateImageDto = Input<typeof newUpdateImageDto>;
export type NewStoreDto = Input<typeof newStoreDto>;
