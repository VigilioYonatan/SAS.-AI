import { boolean, merge, object, omit, type Input } from "@vigilio/valibot";
import { scrappingSchema } from "../schemas/scrapping.schema";

export const scrappingUpdateDto = merge([
    omit(scrappingSchema, ["id"]),
    object({
        enabledCategories: boolean(),
        enabledEventClickCategories: boolean(),
        enabledProducts: boolean(),
        enabledProduct: boolean(),
        enabledEventClickProducts: boolean(),
        enabledEventClickNextPage: boolean(),
    }),
]);
export type ScrappingUpdateDto = Input<typeof scrappingUpdateDto>;
